import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";
import { theme } from "../styles/theme";
import React from "react";
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
        description:
            "Arrivée ou départ, nous assurons vos transferts vers les gares de Gisors, Vernon, Mantes et les aéroports de Roissy, Orly et Beauvais. Ponctualité et confort garantis.",
        image: service1,
        alt: "Transfert aéroport VTC",
    },
    {
        id: 2,
        title: "Circuits touristiques",
        description:
            "Découvrez les trésors de la Normandie avec nos circuits sur mesure : Giverny, Château de Gisors, Lyons-la-Forêt et bien d'autres. Un chauffeur local à votre écoute.",
        image: service2,
        alt: "Circuit touristique VTC",
    },
    {
        id: 3,
        title: "Transport local quotidien",
        description:
            "Pour tous vos déplacements du quotidien : rendez-vous, courses ou trajets ruraux. Un service fiable et personnalisé selon vos besoins.",
        image: service3,
        alt: "Transport local VTC",
    },
    {
        id: 4,
        title: "Événements privés",
        description:
            "Mariages, soirées ou événements spéciaux, offrez à vos invités un transport haut de gamme avec chauffeur dédié pour des moments inoubliables.",
        image: service4,
        alt: "VTC événementiel",
    },
    {
        id: 5,
        title: "Trajets professionnels",
        description:
            "Déplacez-vous professionnellement vers Paris, Cergy ou Rouen en toute sérénité. Un service régulier ou ponctuel adapté à vos impératifs.",
        image: service5,
        alt: "VTC professionnel",
    },
    {
        id: 6,
        title: "Transport de groupes",
        description:
            "Pour les familles ou groupes, nous proposons des véhicules spacieux (jusqu'à 8 personnes) pour vos déplacements loisirs ou aéroports.",
        image: service6,
        alt: "Transport de groupe VTC",
    },
];

const Home = () => {
    const [showMoreTestimonials, setShowMoreTestimonials] =
        React.useState(false);

    const toggleTestimonials = () => {
        setShowMoreTestimonials(!showMoreTestimonials);
    };

    return (
        <>
            <HeroSection>
                <H2>Optez pour l'excellence en VTC</H2>
                <P>
                    "Voyagez en toute sérénité avec notre service VTC haut de
                    gamme : ponctualité, disponibilité, confort et sécurité sont
                    nos maîtres-mots. Votre satisfaction est notre priorité."
                </P>
                <Span1>Reservez un VTC par téléphone 24h/24 7j/7</Span1>
                <Span2>06 00 08 00 00</Span2>
                <Button to="/booking" variant="primary" size="large">
                    Reservez votre VTC
                </Button>
            </HeroSection>

            <ServicesSection>
                <SectionTitle>Nos services VTC</SectionTitle>
                <ServicesGrid>
                    {services.map((service) => (
                        <ServiceCard key={service.id}>
                            <ServiceImage
                                src={service.image}
                                alt={service.alt}
                            />
                            <ServiceContent>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <Button
                                    to="/booking"
                                    variant="primary"
                                    size="medium"
                                >
                                    Réservez votre VTC
                                </Button>
                            </ServiceContent>
                        </ServiceCard>
                    ))}
                </ServicesGrid>
            </ServicesSection>

            <TestimonialsSection>
                <SectionTitle>Ce que disent nos clients</SectionTitle>
                <TestimonialsContainer>
                    <TestimonialCard>
                        <QuoteIcon>"</QuoteIcon>
                        <TestimonialText>
                            Service exceptionnel ! Ponctualité irréprochable et
                            voiture très confortable. Je recommande vivement.
                        </TestimonialText>
                        <Rating>★★★★★</Rating>
                        <ClientName>Marie D.</ClientName>
                        <ClientLocation>Paris</ClientLocation>
                    </TestimonialCard>

                    <Button onClick={toggleTestimonials}>
                        <span>
                            {showMoreTestimonials
                                ? "Voir moins"
                                : "Voir plus d'avis"}
                        </span>
                        <ArrowIcon
                            style={{
                                transform: showMoreTestimonials
                                    ? "rotate(90deg)"
                                    : "none",
                            }}
                        >
                            →
                        </ArrowIcon>
                    </Button>
                    {/* <Button 
            variant="text" 
            onClick={toggleTestimonials}
          >
            {showMoreTestimonials ? 'Voir moins' : 'Voir plus d\'avis'}
          </Button> */}
                    <AdditionalTestimonials
                        className={showMoreTestimonials ? "show" : ""}
                    >
                        <TestimonialCard>
                            <QuoteIcon>"</QuoteIcon>
                            <TestimonialText>
                                Chauffeur très professionnel et sympathique. Je
                                fais systématiquement appel à eux pour mes
                                déplacements professionnels.
                            </TestimonialText>
                            <Rating>★★★★★</Rating>
                            <ClientName>Thomas L.</ClientName>
                            <ClientLocation>Rouen</ClientLocation>
                        </TestimonialCard>

                        <TestimonialCard>
                            <QuoteIcon>"</QuoteIcon>
                            <TestimonialText>
                                Service de grande qualité, j'ai particulièrement
                                apprécié la flexibilité et la réactivité de
                                l'équipe. À recommander sans hésitation !
                            </TestimonialText>
                            <Rating>★★★★★</Rating>
                            <ClientName>Sophie M.</ClientName>
                            <ClientLocation>Gisors</ClientLocation>
                        </TestimonialCard>
                    </AdditionalTestimonials>
                </TestimonialsContainer>
            </TestimonialsSection>
        </>
    );
};

const H2 = styled.h2`
    margin-top: 100px;
    z-index: 2;
    @media (max-width: 480px) {
        margin-top: 200px;
    }
`;

const P = styled.p`
    z-index: 2;
    letter-spacing: 0.09rem;
    max-width: 500px;
`;

const HeroSection = styled.section`
    position: relative;
    box-sizing: border-box;
    max-width: 1440px;
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    padding: 0 10px 30px;
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
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }

    @media (max-width: 480px) {
    }
`;

const Span1 = styled.span`
    color: ${theme.colors.primary};
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 2;
`;

const Span2 = styled.span`
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 2;
`;

const ServicesSection = styled.section`
    padding: 5rem 2rem;
    background-color: ${theme.colors.backgroundLight};
    width: 100%;
    max-width: 1440px;
    box-sizing: border-box;
`;

const TestimonialsSection = styled.section`
    padding: 5rem 2rem;
    background-color: ${theme.colors.backgroundLight};
    text-align: center;
`;

const TestimonialsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
`;

const TestimonialCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-width: 400px;
    margin: 0 auto 2rem;
    position: relative;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
`;

const QuoteIcon = styled.span`
    font-size: 3rem;
    color: ${theme.colors.primary};
    line-height: 1;
    display: block;
    margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
    margin-bottom: 1.5rem;
    font-style: italic;
`;

const Rating = styled.div`
    color: #ffd700;
    font-size: 1.5rem;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
`;

const ClientName = styled.p`
    font-weight: 600;
    color: ${theme.colors.text};
    margin: 0;
`;

const ClientLocation = styled.p`
    color: #666;
    font-size: 0.9rem;
    margin: 0.25rem 0 0;
`;

const ArrowIcon = styled.span`
    display: inline-block;
    transition: transform 0.3s ease;
    margin-left: 10px;
`;

const AdditionalTestimonials = styled.div`
    display: none;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;

    &.show {
        display: grid;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
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
        content: "";
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

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1023px) and (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 767px) {
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
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
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

export default Home;
