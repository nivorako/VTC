import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

// Remplacez par votre clé publique Stripe (clé publiable)
const stripePromise = loadStripe('pk_test_51RZw5JRkTF6EdgwvRqC30aXrGs7GbAJ4WzHJUMgTR6WynTG6xjKI6KdoDXv52F4HpmcahdRCFIdQkPZf9ZE6cCsH00qKvcqxfe');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { totalPrice } = location.state as { totalPrice: number };

  console.log('total price', totalPrice);
  
  // Fonction pour annuler le paiement
  const handleCancel = () => {
    setCancelled(true);
    setError(null);
    setLoading(false);
  };

  // Fonction pour revenir à la page précédente
  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js n'a pas encore chargé
      return;
    }

    setLoading(true);
    setError(null);
    setCancelled(false);

    try {
      // 1. Créer une intention de paiement côté serveur
      const response = await fetch('http://localhost:4000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // montant en centimes
          currency: 'eur',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la création de l\'intention de paiement');
      }

      // 2. Confirmer le paiement avec les détails de la carte
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Élément de carte non trouvé');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Nom du client', // Idéalement récupéré d'un formulaire
            },
          },
        }
      );

      if (stripeError) {
        // Gestion spécifique des erreurs Stripe
        if (stripeError.type === 'card_error') {
          throw new Error(`Erreur de carte: ${stripeError.message}`);
        } else if (stripeError.type === 'validation_error') {
          throw new Error(`Erreur de validation: ${stripeError.message}`);
        } else {
          throw new Error(stripeError.message || 'Erreur de paiement');
        }
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
      } else {
        throw new Error(`Statut du paiement: ${paymentIntent.status}`);
      }
    } catch (err: unknown) {
      // Safely handle unknown error type
      let errorMessage = 'Une erreur est survenue';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Paiement sécurisé</h2>
      <h3>Total: {totalPrice} €</h3>
      
      {success ? (
        <SuccessMessage>
          <h3>Paiement réussi !</h3>
          <p>Votre réservation a été confirmée.</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </SuccessMessage>
      ) : cancelled ? (
        <CancelMessage>
          <h3>Paiement annulé</h3>
          <p>Vous avez annulé votre paiement.</p>
          <Button onClick={handleBack}>Retour à la réservation</Button>
        </CancelMessage>
      ) : (
        <>
          <TestCardsInfo>
            <h4>Cartes de test Stripe:</h4>
            <ul>
              <li><strong>Paiement réussi:</strong> 4242 4242 4242 4242</li>
              <li><strong>Échec (fonds insuffisants):</strong> 4000 0000 0000 9995</li>
              <li><strong>Échec (carte expirée):</strong> 4000 0000 0000 0069</li>
              <li><strong>Échec (erreur CVC):</strong> 4000 0000 0000 0127</li>
            </ul>
            <p>Pour toutes les cartes: date future quelconque, CVC: 3 chiffres</p>
          </TestCardsInfo>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Détails de la carte</Label>
              <CardElementContainer>
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </CardElementContainer>
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <Button 
                type="submit" 
                disabled={!stripe || loading}
                primary
              >
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </Button>
              <Button 
                type="button" 
                onClick={handleCancel}
                secondary
              >
                Annuler le paiement
              </Button>
            </ButtonGroup>
          </form>
        </>
      )}
    </FormContainer>
  );
};

const UserPayment = () => {
  return (
    <Container>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #424770;
`;

const CardElementContainer = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f8f9fa;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ primary?: boolean; secondary?: boolean }>`
  background-color: ${props => 
    props.secondary ? '#f8f9fa' : 
    props.primary ? '#5469d4' : '#5469d4'};
  color: ${props => props.secondary ? '#424770' : 'white'};
  border: ${props => props.secondary ? '1px solid #e6e6e6' : 'none'};
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: ${props => props.secondary ? '0 0 auto' : '1 0 auto'};

  &:hover {
    background-color: ${props => 
      props.secondary ? '#e6e6e6' : 
      props.primary ? '#4a5fc1' : '#4a5fc1'};
  }

  &:disabled {
    background-color: #e6e6e6;
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #df1b41;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #ffeaef;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  color: #0d6832;
  background-color: #d4edda;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
`;

const CancelMessage = styled.div`
  color: #856404;
  background-color: #fff3cd;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
`;

const TestCardsInfo = styled.div`
  background-color: #e7f5ff;
  border: 1px solid #bee5eb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  h4 {
    margin-top: 0;
    color: #0c5460;
  }

  ul {
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0.5rem 0 0;
    font-style: italic;
    font-size: 0.85rem;
  }
`;

export default UserPayment;