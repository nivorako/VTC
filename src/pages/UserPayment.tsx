import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

// Interfaces pour les types
interface PaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  message?: string; // Optional error message from server
}

interface PaymentStatusResponse {
  status: string;
  receiptUrl?: string;
}

// interface PaymentFormProps {
//   totalPrice: number;
//   rideId?: string;
//   userId?: string;
// }


// clé publique Stripe (clé publiable)
const stripePromise = loadStripe('pk_test_51RZw5JRkTF6EdgwvRqC30aXrGs7GbAJ4WzHJUMgTR6WynTG6xjKI6KdoDXv52F4HpmcahdRCFIdQkPZf9ZE6cCsH00qKvcqxfe');

/**
 * Formulaire de paiement pour le trajet sélectionné.
 * 
 * Si le state contient des informations de trajet, le formulaire de paiement est affiché.
 * Sinon, un message d'erreur est affiché avec un bouton pour revenir à l'accueil.
 * 
 * @returns Formulaire de paiement ou un message d'erreur.
 */
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('paymentIntentId', paymentIntentId);

  const location = useLocation();
  
  // Handle the case when no state is provided (e.g., when accessing the page directly)
  const locationState = location.state as { 
    totalPrice: number;
    rideId?: string;
    userId?: string; 
  } | null;
  
  // If no state is provided, show a message and provide a way to go back
  if (!locationState) {
    return (
      <FormContainer>
        <h2>Information de paiement manquante</h2>
        <p>Pour effectuer un paiement, veuillez d'abord sélectionner un trajet.</p>
        <Button 
          type="button" 
          onClick={() => navigate('/')}
          variant="primary"
        >
          Retour à l'accueil
        </Button>
      </FormContainer>
    );
  }
  
  const { totalPrice, rideId, userId } = locationState;

  // Fonction pour vérifier le statut du paiement
  const checkPaymentStatus = async (paymentIntentId: string) => {
    try {
      // Utiliser le proxy configuré dans vite.config.ts
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/payments/payment-status/${paymentIntentId}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la vérification du statut: ${errorText}`);
      }
      
      const data = await response.json() as PaymentStatusResponse;
      
      if (data.status === 'succeeded') {
        setSuccess(true);
        setLoading(false);
        if (data.receiptUrl) {
          setReceiptUrl(data.receiptUrl);
        }
      } else if (data.status === 'failed' || data.status === 'canceled') {
        setError(`Le paiement a échoué (statut: ${data.status})`);
        setLoading(false);
      } else {
        // Statut en attente, vérifier à nouveau dans quelques secondes
        setTimeout(() => checkPaymentStatus(paymentIntentId), 3000);
      }
    } catch (err) {
      setError(`Erreur lors de la vérification du statut: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setLoading(false);
    }
  };
  
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

  /**
   * Fonction pour gérer la soumission du formulaire de paiement.
   * 
   * 1. Crée une intention de paiement côté serveur avec les détails de la course.
   * 2. Confirme le paiement avec les détails de la carte.
   * 3. Vérifie le statut du paiement jusqu'à ce qu'il soit réussi ou échoué.
   * 
   * @param {React.FormEvent} e - Événement de soumission du formulaire
   */
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
      // Utiliser le proxy configuré dans vite.config.ts
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`;
      
      console.log('Envoi de la requête à:', apiUrl);
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(totalPrice * 100), // Arrondir pour éviter les erreurs de précision
            currency: 'eur',
            rideId,
            userId
          }),
        });

        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Si la réponse n'est pas JSON, récupérer le texte brut pour le débogage
          const textResponse = await response.text();
          console.error('Réponse non-JSON reçue:', textResponse);
          throw new Error(`Réponse non-JSON reçue du serveur: ${textResponse.substring(0, 100)}...`);
        }

        const data = await response.json() as PaymentResponse;

        if (!response.ok) {
          throw new Error(data.message || 'Une erreur est survenue lors de la création de l\'intention de paiement');
        }

        // Stocker le paymentIntentId pour vérifier le statut plus tard
        setPaymentIntentId(data.paymentIntentId);

        // 2. Confirmer le paiement avec les détails de la carte
        const cardNumberElement = elements.getElement(CardNumberElement);
        
        if (!cardNumberElement) {
          throw new Error('Élément de carte non trouvé');
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: cardNumberElement,
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
            throw new Error(`Erreur inattendue: ${stripeError.message}`);
          }
        }

        if (paymentIntent) {
          // Commencer à vérifier le statut du paiement
          checkPaymentStatus(paymentIntent.id);
        } else {
          // Si nous n'avons pas de paymentIntent mais pas d'erreur non plus,
          // vérifier le statut avec l'ID que nous avons stocké
          if (data.paymentIntentId) {
            checkPaymentStatus(data.paymentIntentId);
          } else {
            throw new Error('Impossible de confirmer le paiement');
          }
        }
      } catch (fetchError) {
        console.error('Erreur lors de la requête:', fetchError);
        throw fetchError;
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Une erreur inconnue est survenue'}`);
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      {success ? (
        <>
          <SuccessMessage>
            <h3>Paiement réussi!</h3>
            <p>Votre paiement a été traité avec succès.</p>
            {receiptUrl && (
              <p>
                <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                  Voir le reçu
                </a>
              </p>
            )}
          </SuccessMessage>
          <ButtonGroup>
            <Button type="button" onClick={handleBack} variant="primary">
              Retour à l'accueil
            </Button>
          </ButtonGroup>
        </>
      ) : cancelled ? (
        <>
          <CancelMessage>
            <h3>Paiement annulé</h3>
            <p>Vous avez annulé le processus de paiement.</p>
          </CancelMessage>
          <ButtonGroup>
            <Button type="button" onClick={handleBack} variant="primary">
              Retour à l'accueil
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <h2>Paiement sécurisé</h2>
          <p>Montant à payer: {totalPrice.toFixed(2)} €</p>
          
          <TestCardsInfo>
            <h4>Cartes de test Stripe</h4>
            <ul>
              <li><strong>Carte qui réussit:</strong> 4242 4242 4242 4242</li>
              <li><strong>Carte qui échoue:</strong> 4000 0000 0000 0002</li>
            </ul>
            <p>Utilisez n'importe quelle date future, n'importe quel CVC à 3 chiffres et n'importe quel code postal à 5 chiffres.</p>
          </TestCardsInfo>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Numéro de carte</Label>
              <CardElementContainer>
                <CardNumberElement 
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
            
            <FormRow>
              <FormGroup flex="1">
                <Label>Date d'expiration</Label>
                <CardElementContainer>
                  <CardExpiryElement 
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
              
              <FormGroup flex="1">
                <Label>Code de sécurité (CVC)</Label>
                <CardElementContainer>
                  <CardCvcElement 
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
            </FormRow>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <Button 
                type="submit" 
                disabled={!stripe || loading}
                variant="primary"
              >
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </Button>
              <Button 
                type="button" 
                onClick={handleCancel}
                variant="secondary"
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

const FormGroup = styled.div<{ flex?: string }>`
  margin-bottom: 1.5rem;
  flex: ${props => props.flex || 'auto'};
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

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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