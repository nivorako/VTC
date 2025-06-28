import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { Button } from "../components/Button";
import BookingCarDetails from "../components/BookingCarDetails";
import type { BookingInfo } from "../types/booking";

import berlineImg from "../assets/berline.webp";
import berlineLuxImg from "../assets/berlineLUX.webp";
import vanImg from "../assets/van.webp";

    /**
     * Component for booking a car.
     * The component displays a form with options for date, time, departure and arrival,
     * type of trip, number of passengers and vehicle type.
     * The component also displays the total price.
     * The user can select a car and the component will update the form with the selected car type.
     * The component also displays a button to go to the previous page and a button to go to the next page.
     * The user can also go back to the previous page by clicking on the link.
     */
export default function BookingCar() {
    const location = useLocation();
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    const [distance, setDistance] = useState("");
    const [formValues, setFormValues] = useState<BookingInfo>({
        date: "",
        heure: "",
        depart: "",
        arrivee: "",
        typeTrajet: "",
        passagersAdultes: 1,
        passagersEnfants: 0,
        vehicule: null,
    });
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        if (location.state) {
            const { bookingDetails, distance } = location.state as { bookingDetails: BookingInfo, distance: string };
            setFormValues(bookingDetails);
            setDistance(distance);
            if (bookingDetails.vehicule) {
                setSelectedCar(bookingDetails.vehicule);
            }
        }
    }, [location.state]);

    /**
     * Sets the selected car and updates the form values with the selected car type.
     * @param {string} carType The type of car to select.
     */
    const handleSelectCar = (carType: string) => {
        setSelectedCar(carType);
        setFormValues(prev => ({
            ...prev,
            vehicule: carType
        }));
    };

    const handlePriceCalculated = (price: number) => {
        setTotalPrice(price);
    };

    return (
        <Section>
            <StyledH1>RESERVEZ UN VTC MAINTENANT</StyledH1>
            <BookingCarContainer>
                <BookingCarDetailsContainer>
                    <BookingCarDetails
                        bookingInfo={formValues}
                        distance={distance}
                        onPriceCalculated={handlePriceCalculated}
                    />
                </BookingCarDetailsContainer>
                <CarChoices>
                    <Car style={{border: selectedCar === "berline" ? `2px solid ${theme.colors.primaryDark}` : "2px solid transparent"}}>
                        <CarImage src={berlineImg} alt="berline" />
                        <CarInfos>
                            Infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {handleSelectCar("berline")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                    <Car style={{border: selectedCar === "berlineLux" ? `2px solid ${theme.colors.primaryDark}` : "2px solid transparent"}}>
                        <CarImage src={berlineLuxImg} alt="berlineLux" />
                        <CarInfos>
                            infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {handleSelectCar("berlineLux")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                    <Car style={{border: selectedCar === "van" ? `2px solid ${theme.colors.primaryDark}` : "2px solid transparent"}}>
                        <CarImage src={vanImg} alt="van" />
                        <CarInfos>
                            infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {handleSelectCar("van")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                </CarChoices>
            </BookingCarContainer>
            <ButtonsContainer>
                <Link to="/booking" state={{ bookingDetails: formValues, distance }}>
                    <Button variant="secondary" size="medium">
                        Modifier les détails
                    </Button>
                </Link>
                <Link to="/user-contact" state={{ bookingDetails: formValues, distance, totalPrice }}>
                    <Button variant="primary" size="medium" disabled={!selectedCar}>
                        Saisir les coordonnées
                    </Button>
                </Link>
            </ButtonsContainer>
        </Section>
    )
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
`

const BookingCarContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch; /* Modified */
    gap: 1rem;
    flex: 1;
    min-height: 0; /* Prevents flexbox overflow */
    margin-bottom: 1rem;
    @media (max-width: 768px) {
        flex-direction: column;
        /* Le gap est remplacé par une marge sur CarChoices pour un meilleur contrôle */
    }
`

const BookingCarDetailsContainer = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    
    @media (max-width: 1024px) {
        width: 40%;
    }
    @media (max-width: 768px) {
        width: 100%;
        order: 2;
    }
`

const CarChoices = styled.div`
    width: 70%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 10px;

    @media (max-width: 1024px) {
        width: 60%;
    }
    @media (max-width: 768px) {
        width: 100%;
        order: 1;
        margin-bottom: 1rem; /* Ajout d'une marge pour l'espacement */
    }
`
const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 0;
    gap: 1rem;

    a {
        text-decoration: none;
        flex: 1;
        display: flex;
    }

    button {
        width: 100%;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;

        & > a {
            width: 100%;
            max-width: 400px;
        }
    }
`

const Car = styled.div` 
    width: 100%;
    flex: 1 1 auto; // Permet à chaque Car de prendre autant d'espace que possible
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box; 
    overflow: hidden; // Pour éviter le débordement
    transition: border-color 0.3s ease;

    @media (max-width: 768px) {
        min-height: 120px;
    }
`

const CarImage = styled.img`
    width: 60%;
    height: 100%;
    object-fit: contain;
    @media (max-width: 1024px) {
        width: 50%;
    }
    @media (max-width: 768px) {
        width: 40%;
    }
`

const CarInfos = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CarChoice = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
   
    @media (max-width: 768px) {
         button, a {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
    }
`