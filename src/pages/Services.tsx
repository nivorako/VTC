import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";

const ServicesSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(${backgroundIMG});
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    box-sizing: border-box;
    margin: 0 auto;
    color: white;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .5);
        z-index: 1;
    }
`;

/**
 * Page Services.
 * Actuellement une page placeholder "en cours de travail".
 */
export default function Services() {
    return (
        <ServicesSection>
            <h1 style={{zIndex: 2}}>Services</h1>
            <h2 style={{zIndex: 2}}>PAGE EN COURS DE TRAVAIL</h2>
        </ServicesSection>
    );
}
