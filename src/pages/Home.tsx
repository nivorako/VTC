import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";
const Home = () => {
  return (
   
      <Section>
        <H1>Optez pour l'excellence en VTC</H1>
        <P>"Voyagez en toute sérénité avec notre service VTC 
          haut de gamme : ponctualité, disponibilité, 
          confort et sécurité sont nos maîtres-mots. 
          Votre satisfaction est notre priorité."</P>
      </Section>
  
  )
}

const H1 = styled.h1`
  z-index: 2;
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
