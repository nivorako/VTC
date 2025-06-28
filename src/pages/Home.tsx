import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";
import { theme } from "../styles/theme";
import { Button } from "../components/Button";

// Images des services (à remplacer par les vôtres)
import service1 from "../assets/services/airport.jpg";
import service2 from "../assets/services/tour.jpg";
import service3 from "../assets/services/local.jpg";
import service4 from "../assets/services/events.jpg";
import service5 from "../assets/services/business.jpg";
import service6 from "../assets/services/group.jpg";

const services = [
  {
    id: 1,
    title: "Transferts gares et aéroports",
    description: "Arrivée ou départ, nous assurons vos transferts vers les gares de Gisors, Vernon, Mantes et les aéroports de Roissy, Orly et Beauvais. Ponctualité et confort garantis.",
    image: service1,
    alt: "Transfert aéroport VTC"
  },
  {
    id: 2,
    title: "Circuits touristiques",
    description: "Découvrez les trésors de la Normandie avec nos circuits sur mesure : Giverny, Château de Gisors, Lyons-la-Forêt et bien d'autres. Un chauffeur local à votre écoute.",
    image: service2,
    alt: "Circuit touristique VTC"
  },
  {
    id: 3,
    title: "Transport local quotidien",
    description: "Pour tous vos déplacements du quotidien : rendez-vous, courses ou trajets ruraux. Un service fiable et personnalisé selon vos besoins.",
    image: service3,
    alt: "Transport local VTC"
  },
  {
    id: 4,
    title: "Événements privés",
    description: "Mariages, soirées ou événements spéciaux, offrez à vos invités un transport haut de gamme avec chauffeur dédié pour des moments inoubliables.",
    image: service4,
    alt: "VTC événementiel"
  },
  {
    id: 5,
    title: "Trajets professionnels",
    description: "Déplacez-vous professionnellement vers Paris, Cergy ou Rouen en toute sérénité. Un service régulier ou ponctuel adapté à vos impératifs.",
    image: service5,
    alt: "VTC professionnel"
  },
  {
    id: 6,
    title: "Transport de groupes",
    description: "Pour les familles ou groupes, nous proposons des véhicules spacieux (jusqu'à 8 personnes) pour vos déplacements loisirs ou aéroports.",
    image: service6,
    alt: "Transport de groupe VTC"
  }
];

const Home = () => {
  return (
    <>
      <HeroSection>
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
      </HeroSection>

      <ServicesSection>
        <SectionTitle>Nos services VTC</SectionTitle>
        <ServicesGrid>
          {services.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceImage src={service.image} alt={service.alt} />
              <ServiceContent>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Button to="/booking" variant="primary" size="medium">
                  Réservez votre VTC
                </Button>
              </ServiceContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>
    </>
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

const HeroSection = styled.section`
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 30px 30px;
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
  padding-top: 150px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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

const ServicesSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${theme.colors.backgroundLight};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: ${theme.colors.text};
  font-size: 2.5rem;
  position: relative;
  padding-bottom: 1rem;
  width: 100%;
  max-width: 1440px;
  padding: 0 1rem 1rem;      
  
  &::after {
    content: ''; 
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); 
    width: 100px;
    height: 3px;
    background-color: ${theme.colors.text};
  }
  @media (max-width: 480px) {
    font-size: 1.75rem;
    padding: 0 0.5rem 0.75rem;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
    gap: 1.5rem;
  }
`;

const ServiceCard = styled.article`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
  h3 {
    color: ${theme.colors.textWhite};
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    color: ${theme.colors.textWhite};
    margin-bottom: 1.5rem;
    line-height: 1.6;
    flex-grow: 1;
  }
  
  button {
    align-self: flex-start;
    margin-top: auto;
  }
`;

export default Home
