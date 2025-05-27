import { useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import BookingForm from "../components/BookingForm";
import MapWithRoute from "../components/MapWithRoute";

const Booking = () => {
  const [lieuDepart, setLieuDepart] = useState("");
  const [lieuArrivee, setLieuArrivee] = useState("");
  return (
   
      <Section>
        <H2>RESERVEZ UN VTC MAINTENANT</H2>
        <BookingContainer>
            <BookingFormContainer>
              <BookingForm
                onLieuChange={(depart: string, arrivee: string) => {
                  setLieuDepart(depart);
                  setLieuArrivee(arrivee);
                }}
            />
            </BookingFormContainer>
            <Maps>
                <MapWithRoute depart={lieuDepart} arrivee={lieuArrivee} />
            </Maps>
        </BookingContainer>
      </Section>
  
  )
}

const H2 = styled.h2`
  margin-top: 200px;
  z-index: 2;
  @media (max-width: 480px) {
    margin-top: 200px;
  }
`

const Section = styled.section`
    position: relative;
    box-sizing: border-box;
    max-width: 1440px;
    width: 100%;
    height: 100%;
    margin: auto;
    padding: 0 10px;
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
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5); /* Fond noir à 50% d'opacité */
        z-index: 1;
  }
`
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
`

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
`

const Maps = styled.div`
    width: 40%;
    height: 650px;
    background: white;
    border-radius: 10px;
    border: 20px solid #fff;
    z-index: 2;
    @media (max-width: 768px) {
        width: 80%;
    }
`

export default Booking
