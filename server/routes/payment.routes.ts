import { Router, raw } from "express";
import {
    createPaymentIntent,
    getPaymentStatus,
    handleWebhook,
} from "../controllers/payment.controller.js";

const router = Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create a new payment intent
// @access  Public
router.post("/create-payment-intent", createPaymentIntent);

// @route   GET /api/payments/payment-status/:id
// @desc    Get payment status by ID
// @access  Public
router.get("/payment-status/:id", getPaymentStatus);

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post("/webhook", raw({ type: "application/json" }), handleWebhook);

export default router;
