import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styled from 'styled-components';

// Remplacez par votre clé publique Stripe (clé publiable)
const stripePromise = loadStripe('pk_test_51RZw5JRkTF6EdgwvRqC30aXrGs7GbAJ4WzHJUMgTR6WynTG6xjKI6KdoDXv52F4HpmcahdRCFIdQkPZf9ZE6cCsH00qKvcqxfe');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js n'a pas encore chargé
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Créer une intention de paiement côté serveur
      const response = await fetch('http://localhost:4000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // montant en centimes (10€)
          currency: 'eur',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
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
        throw new Error(stripeError.message || 'Erreur de paiement');
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
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
      
      {success ? (
        <SuccessMessage>
          <h3>Paiement réussi !</h3>
          <p>Votre réservation a été confirmée.</p>
        </SuccessMessage>
      ) : (
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

          <Button 
            type="submit" 
            disabled={!stripe || loading}
          >
            {loading ? 'Traitement...' : 'Payer maintenant'}
          </Button>
        </form>
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

const Button = styled.button`
  background-color: #5469d4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #4a5fc1;
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
`;

export default UserPayment;