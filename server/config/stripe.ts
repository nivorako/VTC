import Stripe from 'stripe';


let stripe: Stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('La variable d\'environnement STRIPE_SECRET_KEY n\'est pas définie. Les fonctionnalités de paiement seront désactivées.');
  // Crée une instance factice de Stripe pour éviter les erreurs lors de l'initialisation
  stripe = new Stripe('sk_test_dummy', {
    apiVersion: '2023-10-16',
    typescript: true,
  });
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true,
  });
}

export { stripe };
