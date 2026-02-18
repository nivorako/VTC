import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Check } from "lucide-react";
import { theme } from "../styles/theme";
import BookingCarDetails from "../components/BookingCarDetails";
import MapWithRoute from "../components/MapWithRoute";
import type { BookingInfo } from "../types/booking";

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
        setTotalPrice(calculatePrice(carType));
    };

    /**
     * Callback appelé par `BookingCarDetails` lorsque le prix est calculé côté composant.
     */
    const handlePriceCalculated = (price: number) => {
        setTotalPrice(price);
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
            setTotalPrice(calculatePrice(selectedCar));
        }
    }, [distance, selectedCar, calculatePrice]);

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
                        <CarInfos>
                            <CarTitle>Berline</CarTitle>
                            <CarDescription>vehicule hybride, bas carbonne</CarDescription>
                        </CarInfos>
                        <CarPriceInfo>
                            <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                            <FinalPrice>{calculatePrice("berline") > 0 ? `${calculatePrice("berline").toFixed(2)} €` : "- €"}</FinalPrice>
                        </CarPriceInfo>
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
                        <CarInfos>
                            <CarTitle>Berline de luxe</CarTitle>
                            <CarDescription>vehicule haut de gamme ( Mercedes, BMW, Audi ...)</CarDescription>
                        </CarInfos>
                        <CarPriceInfo>
                            <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                            <FinalPrice>{calculatePrice("berlineLux") > 0 ? `${calculatePrice("berlineLux").toFixed(2)} €` : "- €"}</FinalPrice>
                        </CarPriceInfo>
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
                        <CarInfos>
                            <CarTitle>Van</CarTitle>
                            <CarDescription>idéal pour les voyages en famille</CarDescription>
                        </CarInfos>
                        <CarPriceInfo>
                            <TripType>{formValues.typeTrajet === "aller-retour" ? "Aller et retour" : "Aller simple"}</TripType>
                            <FinalPrice>{calculatePrice("van") > 0 ? `${calculatePrice("van").toFixed(2)} €` : "- €"}</FinalPrice>
                        </CarPriceInfo>
                    </Car>
                </CarChoices>
            </BookingCarContainer>
            {selectedCar && (
                <FixedBottomBar>
                    <VehicleInfo>
                        {getVehicleName(selectedCar)} sélectionné
                    </VehicleInfo>
                    <ValidateButton
                        onClick={() => navigate("/user-contact", {
                            state: { bookingDetails: formValues, distance, totalPrice }
                        })}
                    >
                        Valider ({totalPrice.toFixed(2)}€)
                    </ValidateButton>
                </FixedBottomBar>
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
    width: 30%;
    height: 30%;
    object-fit: contain;
    @media (max-width: 1024px) {
        width: 20%;
    }
    @media (max-width: 768px) {
        width: 20%;
    }
`;

const CarInfos = styled.div`
    width: 45%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    
    @media (max-width: 768px) {
        width: 50%;
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
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-left: 1px solid #e0e0e0;
    
    @media (max-width: 768px) {
        width: 30%;
        padding: 0.25rem;
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
