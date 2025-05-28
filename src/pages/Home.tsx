import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";
import { theme } from "../styles/theme";

import { Button } from "../components/Button";

const Home = () => {
  return (
   
      <Section>
        <H2>Optez pour l'excellence en VTC</H2>
        <P>"Voyagez en toute sérénité avec notre service VTC 
          haut de gamme : ponctualité, disponibilité, 
          confort et sécurité sont nos maîtres-mots. 
          Votre satisfaction est notre priorité."</P>
        <Span1>
          Reservez un VTC par téléphone 24h/24 7j/7
        </Span1>
        <Span2>
          06 00 08 00 00
        </Span2>  
        
          <Button 
            to="/booking"
            variant="primary"
            size="large"
          >
            Reservez votre VTC
          </Button>
        
      </Section>
  
  )
}

const H2 = styled.h2`
  margin-top: 100px;
  z-index: 2;
  @media (max-width: 480px) {
    margin-top: 200px;
  }
`

const P = styled.p`
  z-index: 2;
  letter-spacing: 0.09rem;
  max-width: 500px;
`

const Section = styled.section`
  position: relative;
  box-sizing: border-box;
  max-width: 1440px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 0 30px;
  text-align: center;
  background-image: url(${backgroundIMG});
  background-size: cover;
  background-position: center;
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

const Span1 = styled.span`
  color: ${theme.colors.primary};
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 2;
` 

const Span2 = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 2;
`

export default Home
