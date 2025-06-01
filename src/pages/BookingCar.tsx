import styled from "styled-components";
import { theme } from "../styles/theme";

export default function BookingCar() {
    return (
        <Section>
            <h1 style={{color: "white"}}>BookingCar</h1>
            <BookingCarContainer>
                <BookingCarDetails>
                   BookingCarDetails 
                </BookingCarDetails>
                <CarChoices>
                    CarChoices
                </CarChoices>
            </BookingCarContainer>
        </Section>
    )
}

const Section = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    background: ${theme.colors.background};
`

const BookingCarContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${theme.colors.background};
`

const BookingCarDetails = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
`
const CarChoices = styled.div`
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
`
