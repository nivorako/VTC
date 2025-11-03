import styled from "styled-components";
import { theme } from "../styles/theme";
import BookingForm from "../components/BookingForm";
import MapWithRoute from "../components/MapWithRoute";
import { Button } from "../components/Button";
import { useRef, useState, useEffect } from "react";
import type { BookingInfo } from "../types/booking";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

const Booking = () => {
    // État pour les valeurs brutes du formulaire, mises à jour immédiatement
    const [rawFormValues, setRawFormValues] = useState<
        Omit<BookingInfo, "vehicule">
    >({
        date: "",
        heure: "",
        depart: "",
        arrivee: "",
        typeTrajet: "",
        passagersAdultes: 1,
        passagersEnfants: 0,
    });

    // Valeur débauncée des données du formulaire
    const debouncedFormValuesFromHook = useDebounce(rawFormValues, 500); // Délai de 500ms

    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });
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

    const handleFormChange = (values: Omit<BookingInfo, "vehicule">) => {
        setRawFormValues(values); // Mettre à jour l'état brut immédiatement
    };

    // Mettre à jour l'état principal formValues uniquement lorsque la valeur débauncée change
    useEffect(() => {
        setFormValues((prevValues) => ({
            ...prevValues,
            ...debouncedFormValuesFromHook,
        }));
    }, [debouncedFormValuesFromHook]);

    const handleRouteCalculated = (routeData: {
        distance: string;
        duration: string;
    }) => {
        setRouteInfo(routeData);
    };

    // Déterminer si le formulaire est valide en dérivant l'état.
    const isFormValid = Boolean(
        formValues.date &&
            formValues.heure &&
            formValues.depart &&
            formValues.arrivee &&
            formValues.typeTrajet
    );

    // Effet pour le défilement automatique vers le bouton lorsque le formulaire devient valide.
    useEffect(() => {
        if (isFormValid) {
            // Un petit délai peut aider à s'assurer que le bouton est prêt pour le défilement.
            const timer = setTimeout(() => {
                buttonRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isFormValid]);

    // Contenu original partiellement réintroduit
    return (
        <Section>
            <H2>RESERVEZ UN VTC MAINTENANT</H2>
            <BookingContainer>
                <BookingFormContainer>
                    <BookingForm onFormChange={handleFormChange} />
                    {/* <div style={{ border: '1px dashed blue', padding: '10px', color: 'blue', background: 'rgba(0,0,255,0.1)' }}>Placeholder pour BookingForm</div> */}
                </BookingFormContainer>
                <Maps>
                    <MapWithRoute
                        depart={formValues.depart}
                        arrivee={formValues.arrivee}
                        onRouteCalculated={handleRouteCalculated}
                    />
                </Maps>
            </BookingContainer>
            <Button
                ref={buttonRef}
                variant="primary"
                size="large"
                disabled={!isFormValid}
                onClick={() => {
                    if (isFormValid) {
                        navigate("/BookingCar", {
                            state: {
                                bookingDetails: {
                                    ...formValues,
                                    vehicule: formValues.vehicule || "berline",
                                },
                                distance: routeInfo.distance,
                            },
                        });
                    }
                }}
                type="button"
            >
                Choisir un véhicule
            </Button>
        </Section>
    );
};

const H2 = styled.h2`
    margin-top: 200px;
    z-index: 2;
    @media (max-width: 480px) {
        margin-top: 200px;
    }
`;

const Section = styled.section`
    position: relative;
    /* z-index: 1; Supprimé car potentiellement conflictuel avec d'autres pages */
    box-sizing: border-box;
    max-width: 1440px;
    width: 100%;
    height: 100%;
    margin: auto;
    padding: 0 10px 20px;
    text-align: center;
    background: ${theme.colors.background};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    color: white;
    margin-top: -150px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5); /* Fond noir à 50% d'opacité */
        z-index: 1;
    }
`;
const BookingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    z-index: 2;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const BookingFormContainer = styled.div`
    width: 40%;
    height: 650px;
    overflow-y: auto;
    border: 20px solid #fff;
    border-radius: 10px;
    @media (max-width: 768px) {
        width: 80%;
        min-height: auto;
        height: auto;
    }
`;

const Maps = styled.div`
    width: 40%;
    height: 650px;
    background: white;
    border-radius: 10px;
    border: 20px solid #fff;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        width: 80%;
    }
`;

export default Booking;
