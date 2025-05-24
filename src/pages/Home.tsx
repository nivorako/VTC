import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";
const Home = () => {
  return (
   
      <Section>
        <h1 style={{zIndex: 2}}>Optez pour l'excellence en VTC</h1>
        <p>Service professionnel de transport sur réservation</p>
      </Section>
  
  )
}

const Section = styled.section`
  position: relative;
  box-sizing: border-box;
  max-width: 1440px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-image: url(${backgroundIMG});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

export default Home
