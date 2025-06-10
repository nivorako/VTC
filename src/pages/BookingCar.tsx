import { useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { Button } from "../components/Button";

const Berline = new URL("/src/assets/berline.webp", import.meta.url).href;
const BerlineLux = new URL("/src/assets/berlineLux.webp", import.meta.url).href;
const Van = new URL("/src/assets/van.webp", import.meta.url).href;


export default function BookingCar() {
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    console.log(selectedCar);
    
    return (
        <Section>
            <h1 style={{color: "white"}}>RESERVEZ UN VTC MAINTENANT</h1>
            <BookingCarContainer>
                <BookingCarDetails>
                   Booking CarDetails 
                </BookingCarDetails>
                <CarChoices>
                    <Car style={{border: selectedCar === "berline" ? `20px solid ${theme.colors.primaryDark}` : "none"}}>
                        <CarImage src={Berline} alt="berline" />
                        <CarInfos>
                            Infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                to="/bookingCar"
                                variant="primary"
                                size="medium"
                                onClick={() => {setSelectedCar("berline")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                    <Car style={{border: selectedCar === "BerlineLux" ? `20px solid ${theme.colors.primaryDark}` : "none"}}>
                        <CarImage src={BerlineLux} alt="berlineLux" />
                        <CarInfos>
                            infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                to="/bookingCar"
                                variant="primary"
                                size="medium"
                                onClick={() => {setSelectedCar("BerlineLux")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                    <Car style={{border: selectedCar === "Van" ? `20px solid ${theme.colors.primaryDark}` : "none"}}>
                        <CarImage src={Van} alt="van" />
                        <CarInfos>
                            infos
                        </CarInfos>
                        <CarChoice>
                            <Button
                                to="/bookingCar"
                                variant="primary"
                                size="medium"
                                onClick={() => {setSelectedCar("Van")}}
                            >
                                Choisir
                            </Button>
                        </CarChoice>
                    </Car>  
                    
                </CarChoices>
            </BookingCarContainer>
            
        </Section>
    )
}

const Section = styled.section`
    width: 100%;
    max-width: 1440px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
    background: ${theme.colors.background};
`

const BookingCarContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    @media (max-width: 768px) {
        flex-direction: column;
        height: 90%;
    }
`

const BookingCarDetails = styled.div`
    width: 30%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    @media (max-width: 768px) {
        width: 100%;
        height: 40vh;
        min-height: 200px;
    }
`
const CarChoices = styled.div`
    width: 70%;
    height: 600px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden; // Pour éviter le débordement
    @media (max-width: 1024px) {
        
    }
    @media (max-width: 768px) {
        height: 50vh; 
        width: 100%;
        min-height: 250px;    }
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

    @media (max-width: 768px) {
        height: 16.66%; /* 50vh / 3 = 16.66% */
        min-height: 83px;
    }
`

const CarImage = styled.img`
    width: 60%;
    height: 50%;
    object-fit: contain;
    max-width: 100%;
    display: block;
    margin: 0 auto;
    @media (max-width: 1024px) {
        width: 70%; /* Un peu plus grand au-dessus de 1024px */
        height: 60%;
    }
    @media (max-width: 768px) {
        width: 90%; /* Un peu plus grand sur mobile */
        height: 60%;
    }
`

const CarInfos = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media (max-width: 768px) {
        
    }
`

const CarChoice = styled.div`
    width: 100%;
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