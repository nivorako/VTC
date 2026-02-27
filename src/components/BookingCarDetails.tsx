import styled from "styled-components";
import type { BookingInfo } from "../types/booking";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { ArrowLeft } from "lucide-react";

interface BookingCarDetailsProps {
    bookingInfo: BookingInfo;
    distance: string;
    onPriceCalculated?: (price: number) => void;
    totalPrice?: number;
}

const DetailsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 1.5rem;
    border-radius: 10px; /* Coins arrondis */
    box-sizing: border-box;
    position: relative;

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

const PriceSummary = styled.div`
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const PriceLine = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
`;

const PriceLabel = styled.span`
    font-weight: 600;
`;

const PriceValue = styled.span`
    font-weight: 700;
    color: ${theme.colors.primary};
`;

const ModifyButton = styled.button`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: ${theme.colors.background};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${theme.colors.primaryDark};
        transform: translateX(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateX(0);
    }

    @media (max-width: 768px) {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
        position: static;
        margin-top: 1rem;
        align-self: flex-end;
    }
`;

/**
 * BookingCarDetails component displays the details of a booking,
 * including date, time, departure and arrival, type of trip,
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
    totalPrice: totalPriceTtc,
}) => {
    const navigate = useNavigate();
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

    const hasTotalPriceTtc = typeof totalPriceTtc === "number" && totalPriceTtc > 0;
    const priceHt = hasTotalPriceTtc ? totalPriceTtc / 1.1 : 0;
    const vat = hasTotalPriceTtc ? totalPriceTtc - priceHt : 0;

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
                    <DetailLabel>Distance parcourue:</DetailLabel>
                    {distance || "N/A"}
                </DetailItem>

                {hasTotalPriceTtc && (
                    <PriceSummary>
                        <PriceLine>
                            <PriceLabel>Prix HT :</PriceLabel>
                            <PriceValue>{priceHt.toFixed(2)} €</PriceValue>
                        </PriceLine>
                        <PriceLine>
                            <PriceLabel>TVA (10%) :</PriceLabel>
                            <PriceValue>{vat.toFixed(2)} €</PriceValue>
                        </PriceLine>
                        <PriceLine>
                            <PriceLabel>Total prix :</PriceLabel>
                            <PriceValue>{totalPriceTtc.toFixed(2)} €</PriceValue>
                        </PriceLine>
                    </PriceSummary>
                )}
            </DetailsSection>
            
            <ModifyButton onClick={() => navigate("/booking", { state: { bookingDetails: bookingInfo, distance } })}>
                <ArrowLeft size={16} />
                Modifier détails
            </ModifyButton>
        </DetailsWrapper>
    );
};

export default BookingCarDetails;
