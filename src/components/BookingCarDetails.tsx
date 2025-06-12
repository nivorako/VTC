import styled from 'styled-components';
import type { BookingInfo } from '../types/booking';

interface BookingCarDetailsProps {
  bookingInfo: BookingInfo;
  distance: string;
}

const BookingDetailsContainer = styled.div`
    width: 30%;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 1rem;
    @media (max-width: 768px) {
        width: 100%;
        height: 40vh;
        min-height: 40vh;
`;

const DetailsSection = styled.div`
  margin-bottom: 1.5rem;
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

const BookingCarDetails: React.FC<BookingCarDetailsProps> = ({ bookingInfo, distance }) => {
  // Extraire la distance en chiffres
  const distanceNumber = parseFloat(distance.replace(/[^\d.]/g, ''));

  // Prix par type de véhicule
  const vehiclePrices: { [key: string]: number } = {
    berline: 2,     // 2€ par km
    berlineLux: 3,  // 3€ par km
    van: 2.5        // 2.5€ par km
  };

  let calculatedPricePerKm = 0;
  if (bookingInfo.vehicule && Object.prototype.hasOwnProperty.call(vehiclePrices, bookingInfo.vehicule)) {
    calculatedPricePerKm = vehiclePrices[bookingInfo.vehicule];
  }

  let totalPrice = 0;
  if (!isNaN(distanceNumber) && calculatedPricePerKm > 0) {
    totalPrice = distanceNumber * calculatedPricePerKm;
  } else {
    // Ensure totalPrice is 0 if distance is not a number or vehicle/price is not set
    totalPrice = 0;
  }
  console.log("Bookinginfo", bookingInfo);
  
    return (
        <BookingDetailsContainer>
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
            {bookingInfo.passagersAdultes} Adultes, {bookingInfo.passagersEnfants} Enfants
            </DetailItem>
            
            <DetailItem>
            <DetailLabel>Véhicule:</DetailLabel>
            {bookingInfo.vehicule || 'Non sélectionné'}
            </DetailItem>

            <DetailItem>
            <DetailLabel>Distance parcourue:</DetailLabel>
            {distance || 'N/A'}
            </DetailItem>
        </DetailsSection>

        <PriceSection>
            <span>TOTAL</span>
            <span>{totalPrice.toFixed(2)} €</span>
        </PriceSection>
        </BookingDetailsContainer>
    );
};

export default BookingCarDetails;
