import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BookingCarDetails from "../components/BookingCarDetails";
import { Button } from "../components/Button";
import { theme } from "../styles/theme";
import type { BookingInfo } from "../types/booking";
import { useAuth } from "../auth/AuthContext";
import {
    FaCcMastercard,
    FaCcVisa,
    FaCcAmex,
    FaCheckCircle,
} from "react-icons/fa";

/**
 * Page de saisie des coordonnées utilisateur (contact + optionnellement facturation)
 * et choix de la méthode de paiement.
 *
 * À la validation, redirige vers `/user-payment` en passant les informations
 * nécessaires via `location.state`.
 */
export default function UserContact() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const { bookingDetails, distance, totalPrice } = location.state as {
        bookingDetails: BookingInfo;
        distance: string;
        totalPrice: number;
    };

    const [contactInfo, setContactInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("visa"); // Default to Visa
    const [showBillingAddress, setShowBillingAddress] = useState(false);
    const [billingAddress, setBillingAddress] = useState({
        companyName: "",
        vatNumber: "",
        address: "",
        streetNumber: "",
        city: "",
        region: "",
        zipCode: "",
        country: "",
    });

    type AuthMode = "login" | "register";

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [authPassword, setAuthPassword] = useState("");
    const [authFirstName, setAuthFirstName] = useState("");
    const [authLastName, setAuthLastName] = useState("");
    const [authPhone, setAuthPhone] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const apiBase = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/auth`
        : "/api/auth";

    /**
     * Met à jour les champs de contact (prénom/nom/email/téléphone).
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Met à jour les champs de facturation.
     */
    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBillingAddress((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Soumission du formulaire de coordonnées.
     * Construit l'objet à transmettre à l'étape de paiement et redirige.
     */
    const proceedToPayment = () => {
        navigate("/user-payment", {
            state: {
                bookingDetails,
                contactInfo,
                paymentMethod: selectedPaymentMethod,
                billingAddress,
                totalPrice,
            },
        }); // Redirige vers la page UserPayment
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            proceedToPayment();
            return;
        }

        setAuthError("");

        try {
            const email = contactInfo.email?.trim();
            if (!email) {
                setAuthError("Email est obligatoire.");
                setAuthMode("register");
                setIsAuthModalOpen(true);
                return;
            }

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

            const result = (await response.json()) as { exists?: boolean; message?: string };
            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de la vérification d'email.");
            }

            setAuthMode(result.exists ? "login" : "register");
            setIsAuthModalOpen(true);
        } catch (err) {
            setAuthError(
                err instanceof Error
                    ? err.message
                    : "Une erreur inconnue est survenue."
            );
            setAuthMode("register");
            setIsAuthModalOpen(true);
        }
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthLoading(false);
        setAuthError("");
        setAuthPassword("");
    };

    const handleAuthSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAuthError("");

        const email = contactInfo.email?.trim();
        if (!email || !authPassword) {
            setAuthError("Email et mot de passe sont obligatoires.");
            return;
        }

        setAuthLoading(true);

        try {
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
            proceedToPayment();
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
            <h1 style={{ color: "white" }}>VOS COORDONNÉES</h1>
            <Container>
                <BookingCarDetailsContainer>
                    <BookingCarDetails
                        bookingInfo={bookingDetails}
                        distance={distance}
                        totalPrice={totalPrice}
                    />
                </BookingCarDetailsContainer>
                <ContactFormContainer>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={contactInfo.firstName}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={contactInfo.lastName}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={contactInfo.email}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>

                        <CheckboxWrapper>
                            <input
                                type="checkbox"
                                id="billingAddressToggle"
                                checked={showBillingAddress}
                                onChange={(e) =>
                                    setShowBillingAddress(e.target.checked)
                                }
                            />
                            <Label htmlFor="billingAddressToggle">
                                Ajouter une adresse de facturation
                            </Label>
                        </CheckboxWrapper>

                        {showBillingAddress && (
                            <BillingFormContainer>
                                <InputGroup>
                                    <Label htmlFor="companyName">
                                        Nom de l'entreprise
                                    </Label>
                                    <Input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={billingAddress.companyName}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="vatNumber">
                                        Numéro de TVA
                                    </Label>
                                    <Input
                                        type="text"
                                        id="vatNumber"
                                        name="vatNumber"
                                        value={billingAddress.vatNumber}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="address">Adresse</Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={billingAddress.address}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="streetNumber">
                                        Numéro de rue
                                    </Label>
                                    <Input
                                        type="text"
                                        id="streetNumber"
                                        name="streetNumber"
                                        value={billingAddress.streetNumber}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="city">Ville</Label>
                                    <Input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={billingAddress.city}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="region">Région</Label>
                                    <Input
                                        type="text"
                                        id="region"
                                        name="region"
                                        value={billingAddress.region}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="zipCode">Code Postal</Label>
                                    <Input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={billingAddress.zipCode}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label htmlFor="country">Pays</Label>
                                    <Input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={billingAddress.country}
                                        onChange={handleBillingChange}
                                    />
                                </InputGroup>
                            </BillingFormContainer>
                        )}

                        <PaymentMethodContainer>
                            <h2
                                style={{
                                    textAlign: "center",
                                    color: theme.colors.text,
                                }}
                            >
                                Choisissez votre méthode de paiement
                            </h2>
                            <PaymentIconsContainer>
                                <PaymentIconWrapper
                                    onClick={() =>
                                        setSelectedPaymentMethod("mastercard")
                                    }
                                >
                                    <FaCcMastercard size={80} color="#EB001B" />
                                    {selectedPaymentMethod === "mastercard" && (
                                        <CheckMark />
                                    )}
                                </PaymentIconWrapper>
                                <PaymentIconWrapper
                                    onClick={() =>
                                        setSelectedPaymentMethod("visa")
                                    }
                                >
                                    <FaCcVisa size={80} color="#1A1F71" />
                                    {selectedPaymentMethod === "visa" && (
                                        <CheckMark />
                                    )}
                                </PaymentIconWrapper>
                                <PaymentIconWrapper
                                    onClick={() =>
                                        setSelectedPaymentMethod("amex")
                                    }
                                >
                                    <FaCcAmex size={80} color="#006FCF" />
                                    {selectedPaymentMethod === "amex" && (
                                        <CheckMark />
                                    )}
                                </PaymentIconWrapper>
                            </PaymentIconsContainer>

                            <PaymentDisclaimer>
                                Nous ne stockons jamais vos informations de carte.
                            </PaymentDisclaimer>
                        </PaymentMethodContainer>

                        <LoginAlert>
                            Connexion requise pour confirmer la réservation
                        </LoginAlert>

                        <Button
                            variant="secondary"
                            size="large"
                            type="submit"
                        >
                            Confirmer la réservation
                        </Button>
                    </Form>
                </ContactFormContainer>
            </Container>

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
                                {authMode === "login"
                                    ? "Connexion"
                                    : "Inscription"}
                            </ModalTitle>
                            <ModalCloseButton type="button" onClick={closeAuthModal}>
                                ×
                            </ModalCloseButton>
                        </ModalHeader>

                        <ModalForm onSubmit={handleAuthSubmit}>
                            <InputGroup>
                                <Label htmlFor="authEmail">Email</Label>
                                <Input
                                    id="authEmail"
                                    type="email"
                                    value={contactInfo.email}
                                    readOnly
                                    required
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="authPassword">Mot de passe</Label>
                                <Input
                                    id="authPassword"
                                    type="password"
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    required
                                />
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

const Section = styled.section`
    width: 100%;
    max-width: 1440px;
    box-sizing: border-box;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: ${theme.colors.background};
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1rem;
    flex: 1;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const BookingCarDetailsContainer = styled.div`
    width: 30%;
    & > div {
        height: 100%; // Assure que BookingCarDetails prend toute la hauteur
    }

    @media (max-width: 1024px) {
        width: 40%;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ContactFormContainer = styled.div`
    width: 70%;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        width: 60%;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
`;

const LoginAlert = styled.div`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #fff7ed;
    color: ${theme.colors.text};
    font-weight: 600;
    text-align: center;
`;

const PaymentDisclaimer = styled.div`
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);
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

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const PaymentMethodContainer = styled.div`
    margin-top: 1rem;
`;

const PaymentIconsContainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
`;

const PaymentIconWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;
    min-height: 120px; /* Hauteur pour accommoder l'icône et la coche */

    &:hover {
        background-color: #f0f0f0;
    }
`;

/**
 * Composant représentant une coche de validation.
 */
const CheckMark = () => (
    <div style={{ marginTop: "10px" }}>
        <FaCheckCircle size={24} color={theme.colors.primary} />
    </div>
);

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
        font-weight: normal; // Rendre le label moins gras que les autres
    }
`;

const BillingFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-top: 1px solid #eee;
    padding-top: 1.5rem;
    margin-top: -0.5rem; /* Compenser le gap du formulaire principal */
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
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
