import styled from "styled-components";
import type { BookingInfo } from "../types/booking";
import { useEffect } from "react";

interface BookingCarDetailsProps {
    bookingInfo: BookingInfo;
    distance: string;
    onPriceCalculated?: (price: number) => void;
    totalPrice?: number;
}

const DetailsWrapper = styled.div`
    width: 100%;
    height: 100%; /* Prend toute la hauteur de son parent */
    display: flex;
    flex-direction: column;
    background: white;
    padding: 1.5rem;
    border-radius: 10px; /* Coins arrondis */
    box-sizing: border-box;

    h2 {
        text-align: center;
        margin-top: 0;
        margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
        height: auto; /* La hauteur s'adapte au contenu */
    }
`;

const DetailsSection = styled.div`
    flex-grow: 1; /* Permet à cette section de prendre l'espace disponible */
`;

const DetailItem = styled.div`
    margin-bottom: 1rem;
`;

const DetailLabel = styled.span`
    font-weight: 600;
    margin-right: 1rem;
`;

const PriceSection = styled.div`
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

/**
 * BookingCarDetails component displays the details of a booking,
 * including date, time, departure and arrival, type of trip, number of passengers,
 * vehicle and distance.
 * It also calculates the total price based on the distance and the type of vehicle.
 * The price is displayed at the bottom of the component.
 * @param {BookingCarDetailsProps} props - The props of the component.
 * @returns {JSX.Element} The component.
 */
const BookingCarDetails: React.FC<BookingCarDetailsProps> = ({
    bookingInfo,
    distance,
    onPriceCalculated,
}) => {
    // Extraire la distance en chiffres
    const distanceNumber = parseFloat(distance.replace(/[^\d.]/g, ""));

    // Prix par type de véhicule
    const vehiclePrices: { [key: string]: number } = {
        berline: 2, // 2€ par km
        berlineLux: 3, // 3€ par km
        van: 2.5, // 2.5€ par km
    };

    let calculatedPricePerKm = 0;
    if (
        bookingInfo.vehicule &&
        Object.prototype.hasOwnProperty.call(
            vehiclePrices,
            bookingInfo.vehicule
        )
    ) {
        calculatedPricePerKm = vehiclePrices[bookingInfo.vehicule];
    }

    let totalPrice = 0;
    if (!isNaN(distanceNumber) && calculatedPricePerKm > 0) {
        totalPrice = distanceNumber * calculatedPricePerKm;
    } else {
        // Ensure totalPrice is 0 if distance is not a number or vehicle/price is not set
        totalPrice = 0;
    }

    useEffect(() => {
        if (onPriceCalculated) {
            onPriceCalculated(totalPrice);
        }
    }, [totalPrice, onPriceCalculated]);

    return (
        <DetailsWrapper>
            <h2>Détails de la Réservation</h2>

            <DetailsSection>
                <DetailItem>
                    <DetailLabel>Date:</DetailLabel>
                    {bookingInfo.date}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Heure:</DetailLabel>
                    {bookingInfo.heure}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Lieu de départ:</DetailLabel>
                    {bookingInfo.depart}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Destination:</DetailLabel>
                    {bookingInfo.arrivee}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Type de trajet:</DetailLabel>
                    {bookingInfo.typeTrajet}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Passagers:</DetailLabel>
                    {bookingInfo.passagersAdultes} Adultes,{" "}
                    {bookingInfo.passagersEnfants} Enfants
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Véhicule:</DetailLabel>
                    {bookingInfo.vehicule || "Non sélectionné"}
                </DetailItem>

                <DetailItem>
                    <DetailLabel>Distance parcourue:</DetailLabel>
                    {distance || "N/A"}
                </DetailItem>
            </DetailsSection>

            <PriceSection>
                <span>TOTAL</span>
                <span>{totalPrice.toFixed(2)} €</span>
            </PriceSection>
        </DetailsWrapper>
    );
};

export default BookingCarDetails;
