import { asyncHandler } from '../utils/apiResponse.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';

export const subscribeNewsletter = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler('Please provide an email address', 400));
    }

    try {
        await sendEmail({
            email,
            subject: 'Welcome to Cartify AI Newsletter',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4f46e5; text-align: center;">Cartify AI</h2>
                    <p>Hi there,</p>
                    <p>Thank you for subscribing to the Cartify AI newsletter! You'll now be the first to know about our premium arrivals, AI-driven shopping trends, and exclusive offers.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Shopping</a>
                    </div>
                    <p style="color: #666; font-size: 12px;">If you didn't mean to subscribe, you can ignore this email.</p>
                </div>
            `,
            text: `Welcome to Cartify AI Newsletter! Thank you for subscribing. Visit us at ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
        });

        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to newsletter. Please check your email.'
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Nodemailer Error:', error);
        }
        return next(new ErrorHandler('Subscription failed. System is currently in debug mode.', 500));
    }
});
