// server/server.ts
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import Payment from './models/Payment';

// Load environment variables first
dotenv.config();

// NextFunction est déjà importé plus haut

// Vérifier que la clé API Stripe est définie
let stripe: Stripe;
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('La variable d\'environnement STRIPE_SECRET_KEY n\'est pas définie. Les fonctionnalités de paiement seront désactivées.');
  // Créer une instance factice de Stripe pour éviter les erreurs
  stripe = new Stripe('sk_test_dummy', {
    apiVersion: '2023-10-16'
  });
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Import connectDB function
import connectDB from './config/db';

// Import du modèle Payment depuis le fichier dédié

// Déclarer une variable globale pour suivre l'état de la connexion MongoDB
//let isMongoConnected = false;

// Connexion à la base de données
connectDB();

const app = express();
const port = process.env.PORT || 4000;

// Types pour les requêtes
interface CreatePaymentIntentRequest {
    amount: number;
    currency: string;
    rideId?: string;
    userId?: string;
}

interface WebhookRequest extends Request {
    rawBody?: Buffer;
    headers: {
        'stripe-signature': string;
        [key: string]: string | string[] | undefined;
    };
    body: Buffer;
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://vtc-client.onrender.com'],
  credentials: true
}));

// Use the raw body middleware for all routes except webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    express.raw({type: 'application/json'})(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});



// Route pour créer une intention de paiement
app.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    console.log('Received payment intent request:', req.body);
    
    // Validate the request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Corps de requête invalide' });
    }
    
    const { amount, currency = 'eur', rideId, userId } = req.body as CreatePaymentIntentRequest;
    
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Le montant est requis et doit être un nombre' });
    }

    // Créer une intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        rideId: rideId || null,
        userId: userId || null
      }
    });

    // Créer un enregistrement de paiement dans la base de données (si MongoDB est connecté)
    try {
      // Vérifier si nous sommes en mode développement
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
      
      if (mongoose.connection.readyState === 1) { // 1 = connecté
        await Payment.create({
          paymentIntentId: paymentIntent.id,
          amount,
          currency,
          status: paymentIntent.status,
          userId,
          rideId
        });
        console.log(`Paiement enregistré dans la base de données: ${paymentIntent.id}`);
      } else if (isDevelopment) {
        console.log(`Mode développement: simulation d'enregistrement du paiement ${paymentIntent.id} (MongoDB non connecté)`);
      } else {
        console.warn(`Impossible d'enregistrer le paiement: MongoDB non connecté`);
      }
    } catch (dbError) {
      console.warn(`Impossible d'enregistrer le paiement dans la base de données: ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`);
      // Continuer l'exécution même si l'enregistrement en base échoue
    }

    // Renvoyer le client secret au frontend
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur est survenue',
      error: error instanceof Error ? error.toString() : 'Erreur inconnue'
    });
  }
});

// Route pour vérifier le statut d'un paiement
app.get('/payment-status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id, {
      expand: ['charges']
    }) as unknown as Stripe.PaymentIntent & { 
      charges: { 
        data: Array<Stripe.Charge> 
      } 
    };
    
    res.json({ 
      status: paymentIntent.status,
      receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur est survenue',
      error: error instanceof Error ? error.toString() : 'Erreur inconnue'
    });
  }
});

// Webhook Stripe pour recevoir les événements de paiement
/**
 * Endpoint to handle Stripe webhook events.
 * 
 * This endpoint verifies the signature of incoming webhook events from Stripe
 * using the configured webhook secret. It processes the events for payment intents,
 * specifically handling `payment_intent.succeeded` and `payment_intent.payment_failed` events.
 * 
 * For successful payment intents, it updates the status and other relevant details
 * in the database. For failed intents, it marks the payment as failed in the database.
 * 
 * This endpoint assumes the presence of environment variables for the Stripe webhook
 * secret. If not configured, it logs a warning and returns a response indicating the
 * lack of configuration.
 * 
 * @param {Request} req - The request object containing headers and body
 * @param {Response} res - The response object to send back the result
 */
app.post('/webhook', async (req, res) => {
    const webhookReq = req as WebhookRequest;
    const sig = webhookReq.headers['stripe-signature'] as string;
    let event: Stripe.Event;

  try {
    // Vérifier que le secret webhook est défini
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('La variable d\'environnement STRIPE_WEBHOOK_SECRET n\'est pas définie. Les webhooks Stripe ne fonctionneront pas.');
      return res.status(200).json({ received: true, warning: 'Webhook secret not configured' });
    }

    console.log('Webhook received, verifying signature...');
    
    // Vérifier la signature de l'événement
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );
  } catch (err) {
    console.error(`Erreur de signature webhook: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
  }

  // Gérer les différents types d'événements
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntentFromEvent = event.data.object as Stripe.PaymentIntent;
    
    // Récupérer le PaymentIntent avec les charges étendues
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentFromEvent.id, {
      expand: ['charges']
    }) as unknown as Stripe.PaymentIntent & { 
      charges: { 
        data: Array<Stripe.Charge> 
      } 
    };
    
    // Mettre à jour le statut du paiement dans la base de données
    try {
      await Payment.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { 
          status: 'succeeded',
          receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url || null,
          paymentMethod: paymentIntent.payment_method_types?.[0] || null
        }
      );
      console.log(`Statut du paiement mis à jour dans la base de données (webhook): ${paymentIntent.id}`);
    } catch (dbError) {
      console.warn(`Impossible de mettre à jour le statut du paiement dans la base de données (webhook): ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`);
      // Continuer l'exécution même si la mise à jour en base échoue
    }
    
    console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Mettre à jour le statut du paiement dans la base de données
    try {
      await Payment.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'failed' }
      );
      console.log(`Statut du paiement mis à jour comme échoué dans la base de données: ${paymentIntent.id}`);
    } catch (dbError) {
      console.warn(`Impossible de mettre à jour le statut du paiement comme échoué dans la base de données: ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`);
      // Continuer l'exécution même si la mise à jour en base échoue
    }
    
    console.log(`PaymentIntent ${paymentIntent.id} failed`);
  }

  res.json({received: true});
});

// Add error handling middleware - must be after all route definitions
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Une erreur interne est survenue' });
  // Only call next with error if we haven't sent a response yet
  if (!res.headersSent) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
