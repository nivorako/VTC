import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BookingCarDetails from '../components/BookingCarDetails';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import type { BookingInfo } from '../types/booking';

export default function UserContact() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, distance } = location.state as { bookingDetails: BookingInfo, distance: string };

    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logique de soumission finale
        console.log('Booking confirmed:', { bookingDetails, contactInfo });
        alert('Votre réservation est confirmée !');
        navigate('/'); // Redirige vers la page d'accueil après confirmation
    };

    return (
        <Section>
            <h1 style={{ color: 'white' }}>VOS COORDONNÉES</h1>
            <Container>
                <BookingCarDetailsContainer>
                    <BookingCarDetails bookingInfo={bookingDetails} distance={distance} />
                </BookingCarDetailsContainer>
                <ContactFormContainer>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input type="text" id="firstName" name="firstName" value={contactInfo.firstName} onChange={handleChange} required />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input type="text" id="lastName" name="lastName" value={contactInfo.lastName} onChange={handleChange} required />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" name="email" value={contactInfo.email} onChange={handleChange} required />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input type="tel" id="phone" name="phone" value={contactInfo.phone} onChange={handleChange} required />
                        </InputGroup>
                        <Button variant="primary" size="large" type="submit">
                            Confirmer la réservation
                        </Button>
                    </Form>
                </ContactFormContainer>
            </Container>
        </Section>
    );
}

const Section = styled.section`
    width: 100%;
    max-width: 1440px;
    box-sizing: border-box;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: ${theme.colors.background};
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1rem;
    flex: 1;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const BookingCarDetailsContainer = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    
    & > div {
        height: 100%; // Assure que BookingCarDetails prend toute la hauteur
    }

    @media (max-width: 1024px) {
        width: 40%;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ContactFormContainer = styled.div`
    width: 70%;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        width: 60%;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: bold;
    color: ${theme.colors.text};
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid ${theme.colors.text}; 
    border-radius: 5px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;
