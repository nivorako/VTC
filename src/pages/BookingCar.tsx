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
            <h1 style={{color: "white"}}>BookingCar</h1>
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
    }
`
const CarChoices = styled.div`
    width: 70%;
    height: 600px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 1rem;
    box-sizing: border-box;
    @media (max-width: 768px) {
        width: 100%;
    }
`
const Car = styled.div` 
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    border-radius: 10px;
    @media (max-width: 768px) {
        
    }
`

const CarImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: contain;
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
        
    }
`