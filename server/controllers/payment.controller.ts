import type { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import { stripe } from '../config/stripe.js';

// Types
interface CreatePaymentIntentRequest {
    amount: number;
    currency: string;
    rideId?: string;
    userId?: string;
}



// Controller Functions

/**
 * @desc    Create a new payment intent
 * @route   POST /create-payment-intent
 * @access  Public
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        console.log('Received payment intent request:', req.body);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ message: 'Corps de requête invalide' });
        }

        const { amount, currency = 'eur', rideId, userId } = req.body as CreatePaymentIntentRequest;

        if (!amount || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Le montant est requis et doit être un nombre' });
        }

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

        try {
            const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
            if (mongoose.connection.readyState === 1) { // 1 = connected
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
        }

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
};

/**
 * @desc    Get payment status by ID
 * @route   GET /payment-status/:id
 * @access  Public
 */
export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.json({ status: paymentIntent.status });
    } catch (error) {
        console.error('Erreur lors de la récupération du statut du paiement:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Une erreur est survenue',
            error: error instanceof Error ? error.toString() : 'Erreur inconnue'
        });
    }
};

/**
 * @desc    Handle Stripe webhook events
 * @route   POST /webhook
 * @access  Public
 */
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.warn('La variable d\'environnement STRIPE_WEBHOOK_SECRET n\'est pas définie. Les webhooks Stripe ne fonctionneront pas.');
            return res.status(200).json({ received: true, warning: 'Webhook secret not configured' });
        }

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Erreur de signature webhook: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
            try {
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentSucceeded.id, {
                    expand: ['charges']
                }) as unknown as Stripe.PaymentIntent & { charges: { data: Array<Stripe.Charge> } };

                await Payment.findOneAndUpdate(
                    { paymentIntentId: paymentIntent.id },
                    {
                        status: 'succeeded',
                        receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url || null,
                        paymentMethod: paymentIntent.payment_method_types?.[0] || null
                    }
                );
                console.log(`Statut du paiement mis à jour (webhook): ${paymentIntent.id}`);
            } catch (dbError) {
                console.warn(`Impossible de mettre à jour le statut du paiement (webhook): ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`);
            }
            console.log(`PaymentIntent ${paymentIntentSucceeded.id} succeeded`);
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            try {
                await Payment.findOneAndUpdate(
                    { paymentIntentId: paymentIntentFailed.id },
                    { status: 'failed' }
                );
                console.log(`Statut du paiement mis à jour comme échoué: ${paymentIntentFailed.id}`);
            } catch (dbError) {
                console.warn(`Impossible de mettre à jour le statut du paiement comme échoué: ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`);
            }
            console.log(`PaymentIntent ${paymentIntentFailed.id} failed`);
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
