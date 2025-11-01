import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables early
const envPathFromServer = path.resolve(__dirname, '..', '..', 'server', '.env');
const envPathFromCwd = path.resolve(process.cwd(), '.env');
const envPathFromDist = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(envPathFromServer)) {
  dotenv.config({ path: envPathFromServer });
} else if (fs.existsSync(envPathFromCwd)) {
  dotenv.config({ path: envPathFromCwd });
} else if (fs.existsSync(envPathFromDist)) {
  dotenv.config({ path: envPathFromDist });
}

let stripe: Stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('La variable d\'environnement STRIPE_SECRET_KEY n\'est pas définie. Les fonctionnalités de paiement seront désactivées.');
  // Crée une instance factice de Stripe pour éviter les erreurs lors de l'initialisation
  stripe = new Stripe('sk_test_dummy', {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    typescript: true,
  });
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  });
}

export { stripe };
