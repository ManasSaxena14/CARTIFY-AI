import Stripe from 'stripe';
import { ErrorHandler } from './errorHandler.js';

export const generatePaymentIntent = async (amount) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Stripe secret key is not configured');
        }
        
        if (!amount || amount <= 0) {
            throw new Error('Valid amount is required for payment intent');
        }
        
        const amountInPaise = Math.round(Number(amount));
        if (isNaN(amountInPaise) || amountInPaise <= 0) {
            throw new Error('Amount must be a positive number');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise, 
            currency: "inr",
            metadata: {
                company: "CartifyAI",
            },
        });

        return {
            success: true,
            client_secret: paymentIntent.client_secret,
        };
    } catch (error) {
        if (error.type === 'StripeCardError') {
            throw new Error(`Card error: ${error.message}`);
        } else if (error.type === 'StripeRateLimitError') {
            throw new Error('Too many requests, please try again later');
        } else if (error.type === 'StripeConnectionError') {
            throw new Error('Network error, please try again');
        } else {
            throw new Error(error.message || 'Payment processing failed');
        }
    }
};
