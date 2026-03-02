import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Check, Eye, EyeOff } from "lucide-react";
import { theme } from "../styles/theme";
import BookingCarDetails from "../components/BookingCarDetails";
import MapWithRoute from "../components/MapWithRoute";
import type { BookingInfo } from "../types/booking";
import { useAuth } from "../auth/AuthContext";

import berlineImg from "../assets/berline.webp";
import berlineLuxImg from "../assets/berlineLUX.webp";
import vanImg from "../assets/van.webp";

/**
 * Page de choix du véhicule.
 *
 * Affiche le récapitulatif de la réservation, la carte/itinéraire, puis permet à
 * l'utilisateur de sélectionner un type de véhicule. Le prix total est recalculé
 * en fonction de la distance et du véhicule.
 */
export default function BookingCar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    const [distance, setDistance] = useState("");
    const [formValues, setFormValues] = useState<BookingInfo>({
        date: "",
        heure: "",
        depart: "",
        arrivee: "",
        typeTrajet: "",
        vehicule: null,
    });
    const [totalPrice, setTotalPrice] = useState<number>(0);

    type AuthMode = "login" | "register";

    // Nouveau flow (Mars 2026):
    // Au clic sur "continuer" (FixedBottomBar), si l'utilisateur n'est pas connecté:
    // 1) modal email (champ unique)
    // 2) vérification /api/auth/email-exists
    // 3) modal connexion si email existe, sinon modal inscription
    // 4) si succès, on remplit AuthContext puis on redirige vers /user-contact

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [authEmail, setAuthEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState("");

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [authPassword, setAuthPassword] = useState("");
    const [showAuthPassword, setShowAuthPassword] = useState(false);
    const [authFirstName, setAuthFirstName] = useState("");
    const [authLastName, setAuthLastName] = useState("");
    const [authPhone, setAuthPhone] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    // Résolution du backend d'auth:
    // - Si VITE_API_URL est défini: on cible un backend externe (Render, etc.)
    // - Sinon en DEV: fallback sur le serveur Express local (4001)
    // - Sinon (prod): /api/auth (utile si déployé en serverless sur Vercel)
    const apiBase = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/auth`
        : import.meta.env.DEV
          ? "http://localhost:4001/api/auth"
          : "/api/auth";

    /**
     * Calcule le prix total en fonction du type de véhicule sélectionné et de la distance.
     */
    const calculatePrice = useCallback((vehicleType: string): number => {
        // Prix par type de véhicule (alignés avec BookingCarDetails)
        const vehiclePrices: { [key: string]: number } = {
            berline: 2, // 2€ par km
            berlineLux: 3, // 3€ par km
            van: 2.5, // 2.5€ par km
        };
        
        const distanceNumber = parseFloat(distance.replace(/[^\d.]/g, ""));
        const pricePerKm = vehiclePrices[vehicleType] || 0;
        
        if (!isNaN(distanceNumber) && pricePerKm > 0) {
            return distanceNumber * pricePerKm;
        }
        return 0;
    }, [distance]);

    const calculateVat = useCallback((price: number): number => {
        return price * 0.1;
    }, []);

    const calculatePriceTtc = useCallback((price: number): number => {
        return price + calculateVat(price);
    }, [calculateVat]);

    useEffect(() => {
        if (location.state) {
            const { bookingDetails, distance } = location.state as {
                bookingDetails: BookingInfo;
                distance: string;
            };
            setFormValues(bookingDetails);
            setDistance(distance);
            if (bookingDetails.vehicule) {
                setSelectedCar(bookingDetails.vehicule);
            }
        }
    }, [location.state]);

    /**
     * Sélectionne un véhicule et met à jour l'état de réservation.
     */
    const handleSelectCar = (carType: string) => {
        setSelectedCar(carType);
        setFormValues((prev) => ({
            ...prev,
            vehicule: carType,
        }));
        // Mettre à jour le prix total avec le prix du véhicule sélectionné
        setTotalPrice(calculatePriceTtc(calculatePrice(carType)));
    };

    /**
     * Callback appelé par `BookingCarDetails` lorsque le prix est calculé côté composant.
     */
    const handlePriceCalculated = (price: number) => {
        setTotalPrice(calculatePriceTtc(price));
    };

    /**
     * Callback appelé par `MapWithRoute` lorsque l'itinéraire est calculé.
     * Permet de synchroniser la distance pour le calcul du prix.
     */
    const handleRouteCalculated = (routeData: {
        distance: string;
        duration: string;
    }) => {
        // Mettre à jour la distance avec les données recalculées
        if (routeData.distance) {
            setDistance(routeData.distance);
        }
    };

    // Recalculer le prix lorsque la distance change et qu'un véhicule est sélectionné
    useEffect(() => {
        if (selectedCar && distance) {
            setTotalPrice(calculatePriceTtc(calculatePrice(selectedCar)));
        }
    }, [distance, selectedCar, calculatePrice, calculatePriceTtc]);

    /**
     * Retourne un libellé utilisateur pour un type de véhicule.
     */
    const getVehicleName = (carType: string): string => {
        const vehicleNames: { [key: string]: string } = {
            berline: "Berline",
            berlineLux: "Berline de luxe",
            van: "Van",
        };
        return vehicleNames[carType] || carType;
    };

    const proceedToUserContact = () => {
        navigate("/user-contact", {
            state: { bookingDetails: formValues, distance, totalPrice },
        });
    };

    const resetAuthFlowState = () => {
        // Nettoyage des états UI/erreurs de modals avant de démarrer un nouveau flow.
        setEmailLoading(false);
        setEmailError("");
        setAuthLoading(false);
        setAuthError("");
        setAuthPassword("");
        setAuthFirstName("");
        setAuthLastName("");
        setAuthPhone("");
    };

    const closeEmailModal = () => {
        setIsEmailModalOpen(false);
        setEmailLoading(false);
        setEmailError("");
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthLoading(false);
        setAuthError("");
        setAuthPassword("");
        setShowAuthPassword(false);
    };

    const handleContinueClick = () => {
        if (!selectedCar) return;

        // Si l'utilisateur est déjà connecté, on saute toute l'auth.
        if (user) {
            proceedToUserContact();
            return;
        }

        // Sinon: démarrage du flow par modal email.
        resetAuthFlowState();
        setIsEmailModalOpen(true);
    };

    const handleEmailSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setEmailError("");

        const email = authEmail.trim();
        if (!email) {
            setEmailError("Email est obligatoire.");
            return;
        }

        setEmailLoading(true);

        try {
            // Vérifie si l'email existe déjà en base pour décider login/register.
            const response = await fetch(
                `${apiBase}/email-exists?email=${encodeURIComponent(email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    `Erreur serveur: ${response.status} ${response.statusText}`
                );
            }

            const result = (await response.json()) as {
                exists?: boolean;
                message?: string;
            };
            if (!response.ok) {
                throw new Error(
                    result.message || "Erreur lors de la vérification d'email."
                );
            }

            setAuthMode(result.exists ? "login" : "register");
            setIsEmailModalOpen(false);
            setIsAuthModalOpen(true);
        } catch (err) {
            setEmailError(
                err instanceof Error
                    ? err.message
                    : "Une erreur inconnue est survenue."
            );
        } finally {
            setEmailLoading(false);
        }
    };

    const handleAuthSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAuthError("");

        const email = authEmail.trim();
        if (!email || !authPassword) {
            setAuthError("Email et mot de passe sont obligatoires.");
            return;
        }

        setAuthLoading(true);

        try {
            // Soumission login/register. Si succès, on met à jour AuthContext et on redirige.
            const endpoint = authMode === "login" ? "login" : "register";
            const response = await fetch(`${apiBase}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    authMode === "login"
                        ? { email, password: authPassword }
                        : {
                              email,
                              password: authPassword,
                              firstName: authFirstName,
                              lastName: authLastName,
                              phone: authPhone,
                          }
                ),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    `Erreur serveur: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        (authMode === "login"
                            ? "Erreur lors de la connexion."
                            : "Erreur lors de l'inscription.")
                );
            }

            if (result.user) {
                login(result.user);
            }

            closeAuthModal();
            proceedToUserContact();
        } catch (err) {
            setAuthError(
                err instanceof Error
                    ? err.message
                    : "Une erreur inconnue est survenue."
            );
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <Section>
            <StyledH1>CHOISISSEZ VOTRE VEHICULE</StyledH1>
            <BookingCarContainer>
                <LeftColumn>
                    <BookingCarDetailsContainer>
                        <BookingCarDetails
                            bookingInfo={formValues}
                            distance={distance}
                            onPriceCalculated={handlePriceCalculated}
                        />
                    </BookingCarDetailsContainer>
                    <MapsContainer>
                        <MapWithRoute
                            depart={formValues.depart}
                            arrivee={formValues.arrivee}
                            onRouteCalculated={handleRouteCalculated}
                        />
                    </MapsContainer>
                </LeftColumn>
                <CarChoices>
                    <Car
                        onClick={() => handleSelectCar("berline")}
                        $isSelected={selectedCar === "berline"}
                    >
                        {selectedCar === "berline" && (
                            <CheckIcon>
                                <Check size={24} color="white" />
                            </CheckIcon>
                        )}
                        <CarImage src={berlineImg} alt="berline" />
                        <CarBottomRow>
                            <CarInfos>
                                <CarTitle>Berline</CarTitle>
                                <CarDescription>vehicule hybride, bas carbonne</CarDescription>
                            </CarInfos>
                            <CarPriceInfo>
                                <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                                <PriceRow>
                                    <PriceLabel>Prix HT :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("berline") > 0
                                            ? `${calculatePrice("berline").toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>TVA (10%) :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("berline") > 0
                                            ? `${calculateVat(calculatePrice("berline")).toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>Total prix TTC :</PriceLabel>
                                    <FinalPrice>
                                        {calculatePrice("berline") > 0
                                            ? `${calculatePriceTtc(calculatePrice("berline")).toFixed(2)} €`
                                            : "- €"}
                                    </FinalPrice>
                                </PriceRow>
                            </CarPriceInfo>
                        </CarBottomRow>
                    </Car>
                    <Car
                        onClick={() => handleSelectCar("berlineLux")}
                        $isSelected={selectedCar === "berlineLux"}
                    >
                        {selectedCar === "berlineLux" && (
                            <CheckIcon>
                                <Check size={24} color="white" />
                            </CheckIcon>
                        )}
                        <CarImage src={berlineLuxImg} alt="berlineLux" />
                        <CarBottomRow>
                            <CarInfos>
                                <CarTitle>Berline de luxe</CarTitle>
                                <CarDescription>vehicule haut de gamme ( Mercedes, BMW, Audi ...)</CarDescription>
                            </CarInfos>
                            <CarPriceInfo>
                                <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                                <PriceRow>
                                    <PriceLabel>Prix HT :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("berlineLux") > 0
                                            ? `${calculatePrice("berlineLux").toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>TVA (10%) :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("berlineLux") > 0
                                            ? `${calculateVat(calculatePrice("berlineLux")).toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>Total prix TTC :</PriceLabel>
                                    <FinalPrice>
                                        {calculatePrice("berlineLux") > 0
                                            ? `${calculatePriceTtc(calculatePrice("berlineLux")).toFixed(2)} €`
                                            : "- €"}
                                    </FinalPrice>
                                </PriceRow>
                            </CarPriceInfo>
                        </CarBottomRow>
                    </Car>
                    <Car
                        onClick={() => handleSelectCar("van")}
                        $isSelected={selectedCar === "van"}
                    >
                        {selectedCar === "van" && (
                            <CheckIcon>
                                <Check size={24} color="white" />
                            </CheckIcon>
                        )}
                        <CarImage src={vanImg} alt="van" />
                        <CarBottomRow>
                            <CarInfos>
                                <CarTitle>Van</CarTitle>
                                <CarDescription>idéal pour les voyages en famille</CarDescription>
                            </CarInfos>
                            <CarPriceInfo>
                                <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                                <PriceRow>
                                    <PriceLabel>Prix HT :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("van") > 0
                                            ? `${calculatePrice("van").toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>TVA (10%) :</PriceLabel>
                                    <PriceValue>
                                        {calculatePrice("van") > 0
                                            ? `${calculateVat(calculatePrice("van")).toFixed(2)} €`
                                            : "- €"}
                                    </PriceValue>
                                </PriceRow>
                                <PriceRow>
                                    <PriceLabel>Total prix TTC :</PriceLabel>
                                    <FinalPrice>
                                        {calculatePrice("van") > 0
                                            ? `${calculatePriceTtc(calculatePrice("van")).toFixed(2)} €`
                                            : "- €"}
                                    </FinalPrice>
                                </PriceRow>
                            </CarPriceInfo>
                        </CarBottomRow>
                    </Car>
                </CarChoices>
            </BookingCarContainer>
            {selectedCar && (
                <FixedBottomBar>
                    <VehicleInfo>
                        {getVehicleName(selectedCar)} : {totalPrice.toFixed(2)}€
                    </VehicleInfo>
                    <ValidateButton
                        onClick={handleContinueClick}
                    >
                        continuer 
                    </ValidateButton>
                </FixedBottomBar>
            )}

            {isEmailModalOpen && (
                <ModalOverlay
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeEmailModal();
                    }}
                >
                    <ModalCard>
                        <ModalHeader>
                            <ModalTitle>Email</ModalTitle>
                            <ModalCloseButton type="button" onClick={closeEmailModal}>
                                ×
                            </ModalCloseButton>
                        </ModalHeader>

                        <ModalForm onSubmit={handleEmailSubmit}>
                            <InputGroup>
                                <Label htmlFor="authEmail">Email</Label>
                                <Input
                                    id="authEmail"
                                    type="email"
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    required
                                />
                            </InputGroup>

                            {emailError && <ModalError>{emailError}</ModalError>}

                            <ModalPrimaryButton type="submit" disabled={emailLoading}>
                                {emailLoading ? "Vérification..." : "Continuer"}
                            </ModalPrimaryButton>
                        </ModalForm>
                    </ModalCard>
                </ModalOverlay>
            )}

            {isAuthModalOpen && (
                <ModalOverlay
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeAuthModal();
                    }}
                >
                    <ModalCard>
                        <ModalHeader>
                            <ModalTitle>
                                {authMode === "login" ? "Connexion" : "Inscription"}
                            </ModalTitle>
                            <ModalCloseButton type="button" onClick={closeAuthModal}>
                                ×
                            </ModalCloseButton>
                        </ModalHeader>

                        <ModalForm onSubmit={handleAuthSubmit}>
                            <InputGroup>
                                <Label htmlFor="authEmailReadonly">Email</Label>
                                <Input
                                    id="authEmailReadonly"
                                    type="email"
                                    value={authEmail}
                                    readOnly
                                    required
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="authPassword">Mot de passe</Label>
                                <PasswordInputWrapper>
                                    <Input
                                        id="authPassword"
                                        type={showAuthPassword ? "text" : "password"}
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        required
                                    />
                                    <PasswordIconButton
                                        type="button"
                                        aria-label={
                                            showAuthPassword
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                        onClick={() =>
                                            setShowAuthPassword((prev) => !prev)
                                        }
                                    >
                                        {showAuthPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </PasswordIconButton>
                                </PasswordInputWrapper>
                            </InputGroup>

                            {authMode === "register" && (
                                <>
                                    <InputGroup>
                                        <Label htmlFor="authFirstName">Prénom</Label>
                                        <Input
                                            id="authFirstName"
                                            type="text"
                                            value={authFirstName}
                                            onChange={(e) =>
                                                setAuthFirstName(e.target.value)
                                            }
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <Label htmlFor="authLastName">Nom</Label>
                                        <Input
                                            id="authLastName"
                                            type="text"
                                            value={authLastName}
                                            onChange={(e) =>
                                                setAuthLastName(e.target.value)
                                            }
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <Label htmlFor="authPhone">Téléphone</Label>
                                        <Input
                                            id="authPhone"
                                            type="tel"
                                            value={authPhone}
                                            onChange={(e) => setAuthPhone(e.target.value)}
                                        />
                                    </InputGroup>
                                </>
                            )}

                            {authError && <ModalError>{authError}</ModalError>}

                            <ModalPrimaryButton type="submit" disabled={authLoading}>
                                {authLoading
                                    ? authMode === "login"
                                        ? "Connexion en cours..."
                                        : "Inscription en cours..."
                                    : authMode === "login"
                                      ? "Me connecter"
                                      : "M'inscrire"}
                            </ModalPrimaryButton>

                            <ModalSwitchButton
                                type="button"
                                onClick={() => {
                                    setAuthMode((prev) =>
                                        prev === "login" ? "register" : "login"
                                    );
                                    setAuthError("");
                                }}
                                disabled={authLoading}
                            >
                                {authMode === "login"
                                    ? "Créer un compte"
                                    : "J'ai déjà un compte"}
                            </ModalSwitchButton>
                        </ModalForm>
                    </ModalCard>
                </ModalOverlay>
            )}
        </Section>
    );
}

const StyledH1 = styled.h1`
    color: white;
    margin-top: 100px; /* Similaire au H2 de Booking.tsx */
    margin-bottom: 2rem; /* Espace sous le titre */
    z-index: 2;
    text-align: center;
    @media (max-width: 480px) {
        margin-top: 100px; /* Ajustement pour les très petits écrans */
        font-size: 1.5rem; /* Ajustement de la taille pour mobile */
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    top: 70px;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 2000;
`;

const ModalCard = styled.div`
    width: 100%;
    max-width: 520px;
    background: #ffffff;
    color: #111827;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    padding: 1.25rem;
    box-sizing: border-box;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    color: ${theme.colors.text};
`;

const ModalCloseButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: transparent;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ModalError = styled.div`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #fef2f2;
    color: #991b1b;
    font-weight: 600;
`;

const ModalPrimaryButton = styled.button`
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 8px;
    border: none;
    background: ${theme.colors.background};
    color: #ffffff;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

const ModalSwitchButton = styled.button`
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: transparent;
    color: ${theme.colors.text};
    font-weight: 700;
    cursor: pointer;

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: bold;
    color: ${theme.colors.text};
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid ${theme.colors.text};
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const PasswordInputWrapper = styled.div`
    position: relative;
    width: 100%;

    & > input {
        width: 100%;
        padding-right: 3.25rem;
    }
`;

const PasswordIconButton = styled.button`
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: #ffffff;
    cursor: pointer;
    color: ${theme.colors.text};
`;

const PriceRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
`;

const PriceLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${theme.colors.text};
    text-align: left;
`;

const PriceValue = styled.div`
    font-size: 0.95rem;
    font-weight: 700;
    color: ${theme.colors.primary};
    text-align: right;
`;

const Section = styled.section`
    width: 100%;
    max-width: 1440px;
    box-sizing: border-box;
    min-height: 100vh; /* Assure que la section prend au moins toute la hauteur de la vue */
    display: flex;
    /* justify-content: center; Retiré pour permettre au titre d'être en haut */
    flex-direction: column;
    align-items: center;
    padding: 0 1rem 2rem; /* Ajout de padding en bas */
    background: ${theme.colors.background};
    position: relative; /* Pour le z-index du titre si besoin */

    /* Similaire au ::before de Booking.tsx pour l'overlay si nécessaire */
    /* &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5); 
        z-index: 1;
  } */
`;

const BookingCarContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1rem;
    flex: 1;
    min-height: 0;
    margin-bottom: 1rem;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LeftColumn = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 768px) {
        width: 100%;
        order: 2;
    }
`;

const BookingCarDetailsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const MapsContainer = styled.div`
    width: 100%;
    background: white;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
`;

const CarChoices = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: ${theme.colors.background};
    //padding: 1rem;
    box-sizing: border-box;
    border-radius: 10px;

    @media (max-width: 768px) {
        width: 100%;
        order: 1;
        margin-bottom: 1rem;
    }
`;
const FixedBottomBar = styled.div`
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 400px;
    max-width: 600px;
    width: fit-content;
    border-radius: 10px;
    background: ${theme.colors.primaryDark};
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;

    @media (max-width: 768px) {
        min-width: 150px;
        max-width: 90%;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
    }
`;

const VehicleInfo = styled.div`
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    
    @media (max-width: 768px) {
        font-size: 0.85rem;
        text-align: center;
        white-space: nowrap;
    }
`;

const ValidateButton = styled.button`
    background: white;
    color: ${theme.colors.primaryDark};
    border: none;
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${theme.colors.background};
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        width: auto;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        white-space: nowrap;
    }
`;

const Car = styled.div<{ $isSelected: boolean }>`
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
    overflow: visible;
    position: relative;
    border: ${props => props.$isSelected 
        ? `6px solid ${theme.colors.primaryDark}` 
        : '6px solid transparent'};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: ${theme.colors.primaryDark};
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        min-height: 120px;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: 0.75rem;
    }
`;

const CarBottomRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    gap: 0.75rem;

    @media (max-width: 425px) {
        flex-direction: column;
    }
`;

const CheckIcon = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    background: ${theme.colors.primaryDark};
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
`;

const CarImage = styled.img`
    width: 33%;
    height: 30%;
    object-fit: contain;
    @media (max-width: 1024px) {
        
    }
    @media (max-width: 768px) {
        width: 50%;
        align-self: center;
        margin: 0 auto;
        height: auto;
        max-height: 150px;
    }
`;

const CarInfos = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    
    @media (max-width: 768px) {
        width: 50%;
        padding: 0.25rem;
    }

    @media (max-width: 425px) {
        width: 100%;
    }
`;

const CarTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${theme.colors.primaryDark};
    margin: 0;
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const CarDescription = styled.p`
    font-size: 0.9rem;
    color: ${theme.colors.text};
    margin: 0;
    line-height: 1.4;
    
    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;

const CarPriceInfo = styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-left: 1px solid #e0e0e0;
    
    @media (max-width: 768px) {
        width: 50%;
        padding: 0.25rem;
        border-left: none;
    }

    @media (max-width: 425px) {
        width: 100%;
    }
`;

const TripType = styled.div`
    font-size: 0.9rem;
    font-weight: 500;
    color: ${theme.colors.primaryDark};
    text-align: center;
    
    @media (max-width: 768px) {
        font-size: 0.75rem;
    }
`;

const FinalPrice = styled.div`
    font-size: 1.2rem;
    font-weight: 700;
    color: ${theme.colors.primary};
    text-align: center;
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;
