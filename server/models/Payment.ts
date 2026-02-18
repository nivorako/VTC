// models/Payment.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface définissant la structure d'un document Payment
export interface IPayment extends Document {
    paymentIntentId: string;
    amount: number;
    currency: string;
    status:
        | "succeeded"
        | "processing"
        | "requires_payment_method"
        | "requires_confirmation"
        | "canceled"
        | "failed";
    userId?: string;
    rideId?: string;
    paymentMethod?: string;
    receiptUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schéma Mongoose pour les paiements
const paymentSchema = new Schema<IPayment>({
    paymentIntentId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "eur",
    },
    status: {
        type: String,
        required: true,
        enum: [
            "succeeded",
            "processing",
            "requires_payment_method",
            "requires_confirmation",
            "canceled",
            "failed",
        ],
    },
    userId: {
        type: String,
        required: false, // Optionnel si vous n'avez pas encore d'authentification
    },
    rideId: {
        type: String,
        required: false, // Référence à la course associée
    },
    paymentMethod: {
        type: String,
        required: false,
    },
    receiptUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware pour mettre à jour le champ updatedAt avant chaque sauvegarde
/**
 * Met à jour `updatedAt` avant chaque sauvegarde Mongoose.
 */
paymentSchema.pre("save", function (next: () => void) {
    (this as IPayment).updatedAt = new Date();
    next();
});

// Création et export du modèle
/**
 * Modèle Mongoose pour les paiements Stripe.
 */
const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
