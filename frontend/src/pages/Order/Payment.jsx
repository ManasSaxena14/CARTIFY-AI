import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
    Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AnimatePresence } from 'framer-motion';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_51QdD6wL6m0B0y1z6a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z');
import {
    CreditCard, Lock, ShieldCheck, Truck, Loader,
    Sparkles, CheckCircle, Smartphone, Globe, Info,
    Wallet, IndianRupee, Smartphone as PhoneIcon
} from 'lucide-react';
import orderAPI from '../../api/orderAPI';
import cartAPI from '../../api/cartAPI';
import { calculatePrices } from '../../utils/pricing';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('COD');
    const [upiId, setUpiId] = useState('');
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.country || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
            navigate('/shipping');
            return;
        }

        if (selectedMethod === 'Stripe' && stripePromise) {
            const getPaymentIntent = async () => {
                try {
                    const { data } = await orderAPI.createPaymentIntent();
                    setClientSecret(data.clientSecret);
                } catch {
                    setError('Failed to initialize secure connection. Please refresh.');
                }
            };

            getPaymentIntent();
        }
    }, [navigate, selectedMethod, shippingInfo.address, shippingInfo.city, shippingInfo.country, shippingInfo.pinCode, shippingInfo.phoneNo, shippingInfo.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication required. Please login again.');
                setProcessing(false);
                navigate('/login');
                return;
            }

            if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.country || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
                setError('Shipping information is incomplete. Please go back and update your shipping details.');
                setProcessing(false);
                return;
            }

            let cartResponse;
            try {
                cartResponse = await cartAPI.getMyCart();
            } catch (cartError) {
                // Log cartError for debugging if needed
                setError('Unable to retrieve cart information. Please try again.');
                setProcessing(false);
                return;
            }

            const cartData = cartResponse.data.data;

            if (!cartData || !cartData.items || cartData.items.length === 0) {
                setError('Your cart is empty. Cannot place order.');
                setProcessing(false);
                return;
            }

            const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(cartData.totalPrice || 0);

            if (isNaN(itemsPrice) || isNaN(taxPrice) || isNaN(shippingPrice) || isNaN(totalPrice)) {
                setError('Invalid pricing calculation. Please try again.');
                setProcessing(false);
                return;
            }

            if (selectedMethod === 'Stripe') {
                if (!stripe || !elements || !clientSecret) {
                    setError('Stripe is not available. Please select another payment method.');
                    setProcessing(false);
                    return;
                }

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: 'Premium Member',
                            address: {
                                line1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                postal_code: shippingInfo.pinCode,
                                country: 'IN',
                            }
                        },
                    },
                });

                if (result.error) {
                    setError(result.error.message);
                    setProcessing(false);
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        const paymentInfo = {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status,
                            method: 'Stripe'
                        };

                        await orderAPI.placeOrder({
                            shippingInfo,
                            paymentInfo,
                            itemsPrice,
                            taxPrice,
                            shippingPrice,
                            totalPrice
                        });

                        navigate('/success');
                    } else {
                        setError('Settlement interruption. Contact support.');
                        setProcessing(false);
                    }
                }
            } else if (selectedMethod === 'COD') {
                const paymentInfo = {
                    id: 'cod_' + Date.now(),
                    status: 'Pending',
                    method: 'COD'
                };

                await orderAPI.placeOrder({
                    shippingInfo,
                    paymentInfo,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                });
                navigate('/success');
            } else if (selectedMethod === 'UPI') {
                const paymentInfo = {
                    id: 'upi_' + Date.now(),
                    status: 'Pending',
                    method: 'UPI',
                    upiId: upiId // Include UPI ID if provided
                };

                await orderAPI.placeOrder({
                    shippingInfo,
                    paymentInfo,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                });
                navigate('/success');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. Please try again.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Bad request. Please check your information and try again.');
            } else {
                setError(err.response?.data?.message || err.message || 'Transaction failed. Access denied.');
            }
            setProcessing(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1e293b',
                '::placeholder': {
                    color: '#94a3b8',
                },
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
            },
            invalid: {
                color: '#e11d48',
            },
        },
    };

    const steps = [
        { id: 1, name: 'Logistics', status: 'complete', icon: Truck },
        { id: 2, name: 'Settlement', status: 'current', icon: ShieldCheck }
    ];

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await cartAPI.getMyCart();
                const cartData = response.data.data;

                if (!cartData || !cartData.items || cartData.items.length === 0) {
                    setError('Your cart is empty. Cannot proceed with payment.');
                    setTimeout(() => {
                        navigate('/products');
                    }, 3000);
                }
            } catch {
                // Silently handle fetch error for initial check
            }
        };

        if (shippingInfo && shippingInfo.address) {
            fetchCartData();
        }
    }, [shippingInfo.address, navigate]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
            {/* High-End Progress Stepper */}
            <div className="w-full max-w-2xl mb-16">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -z-10 transform -translate-y-1/2"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 bg-white px-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${step.status === 'current' ? 'bg-primary text-white shadow-primary/20 scale-110' : step.status === 'complete' ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-text-light'}`}>
                                {step.status === 'complete' ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                            </div>
                            <span className={`text-[0.65rem] font-black uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-primary' : 'text-primary opacity-60'}`}>{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-12"
            >
                {/* Visual Context Sidebar */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                            <Lock className="w-4 h-4" />
                            Encrypted Gateway
                        </div>
                        <h1 className="text-4xl font-display text-text-dark tracking-tighter leading-tight">
                            Secure <br /> <span className="text-primary italic">Settlement.</span>
                        </h1>
                        <p className="text-text-light font-medium leading-relaxed">Finalize your curation with our military-grade encrypted payment infrastructure. Your data remains strictly private.</p>
                    </div>

                    <div className="bg-text-dark text-white p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <Smartphone className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-light backdrop-blur-md">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black tracking-tight leading-none mb-1">Universal Acceptance</h4>
                                <p className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest">Global Protocol V2.4</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest">Service Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-green-400">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form Container */}
                <div className="lg:col-span-3">
                    <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 rounded-[3rem] shadow-[0_48px_80px_-32px_rgba(0,0,0,0.1)] relative">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-secondary/5 border border-secondary/10 text-secondary p-4 rounded-2xl text-xs font-bold leading-relaxed flex items-center gap-3"
                                    >
                                        <Info className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Payment Method Selection */}
                            <div className="space-y-4">
                                <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                    Select Payment Method
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedMethod('Stripe')}
                                        className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedMethod === 'Stripe' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'}`}
                                    >
                                        <CreditCard className={`w-6 h-6 ${selectedMethod === 'Stripe' ? 'text-primary' : 'text-text-light'}`} />
                                        <span className="font-bold text-sm">Credit/Debit Card</span>
                                        <span className="text-xs text-text-light/70">Secure Online Payment</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedMethod('COD')}
                                        className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'}`}
                                    >
                                        <IndianRupee className={`w-6 h-6 ${selectedMethod === 'COD' ? 'text-primary' : 'text-text-light'}`} />
                                        <span className="font-bold text-sm">Cash On Delivery</span>
                                        <span className="text-xs text-text-light/70">Pay at doorstep</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedMethod('UPI')}
                                        className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'}`}
                                    >
                                        <PhoneIcon className={`w-6 h-6 ${selectedMethod === 'UPI' ? 'text-primary' : 'text-text-light'}`} />
                                        <span className="font-bold text-sm">UPI</span>
                                        <span className="text-xs text-text-light/70">Instant payment</span>
                                    </button>
                                </div>
                            </div>

                            {/* Conditional rendering based on selected payment method */}
                            {selectedMethod === 'Stripe' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" /> Card Credentials
                                        </label>
                                        <div className="p-4 bg-background-light border border-slate-100 rounded-2xl focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all">
                                            <CardNumberElement options={cardStyle} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1">Expiry Date</label>
                                            <div className="p-4 bg-background-light border border-slate-100 rounded-2xl focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all">
                                                <CardExpiryElement options={cardStyle} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Lock className="w-3 h-3" /> CVV Code
                                            </label>
                                            <div className="p-4 bg-background-light border border-slate-100 rounded-2xl focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all">
                                                <CardCvcElement options={cardStyle} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'UPI' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <PhoneIcon className="w-3 h-3" /> UPI ID
                                        </label>
                                        <div className="p-4 bg-background-light border border-slate-100 rounded-2xl">
                                            <input
                                                type="text"
                                                placeholder="Enter your UPI ID (e.g., yourname@bank)"
                                                className="w-full bg-transparent text-base font-medium outline-none"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing || (selectedMethod === 'Stripe' && (!clientSecret || !stripe || !elements))}
                                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/20 flex items-center justify-center group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-3">
                                        <Loader className="w-6 h-6 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        {selectedMethod === 'Stripe' && 'Confirm Card Payment'}
                                        {selectedMethod === 'COD' && 'Confirm Cash on Delivery'}
                                        {selectedMethod === 'UPI' && 'Confirm UPI Payment'}
                                    </div>
                                )}
                            </motion.button>

                            <p className="text-[0.6rem] text-center font-bold text-text-light/50 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> PCI DSS COMPLIANT INFRASTRUCTURE
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Payment = () => {
    const [stripeReady, setStripeReady] = useState(false);
    const [stripeAvailable, setStripeAvailable] = useState(true);

    useEffect(() => {
        // Check if Stripe is available
        stripePromise.then(stripe => {
            if (stripe) {
                setStripeReady(true);
                setStripeAvailable(true);
            } else {
                setStripeAvailable(false);
                setStripeReady(true);
            }
        }).catch(() => {
            setStripeAvailable(false);
            setStripeReady(true);
        });
    }, []);

    if (!stripeReady) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stripeAvailable) {
        return <PaymentFormWithoutStripeElements />;
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

const PaymentFormWithoutStripeElements = () => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('COD');
    const [upiId, setUpiId] = useState('');

    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.country || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
            navigate('/shipping');
            return;
        }
    }, [navigate, shippingInfo.address, shippingInfo.city, shippingInfo.country, shippingInfo.pinCode, shippingInfo.phoneNo, shippingInfo.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication required. Please login again.');
                setProcessing(false);
                navigate('/login');
                return;
            }

            if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.country || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
                setError('Shipping information is incomplete. Please go back and update your shipping details.');
                setProcessing(false);
                return;
            }

            let cartResponse;
            try {
                cartResponse = await cartAPI.getMyCart();
            } catch (cartError) {
                // Log cartError for debugging if needed
                setError('Unable to retrieve cart information. Please try again.');
                setProcessing(false);
                return;
            }

            const cartData = cartResponse.data.data;

            if (!cartData || !cartData.items || cartData.items.length === 0) {
                setError('Your cart is empty. Cannot place order.');
                setProcessing(false);
                return;
            }

            const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(cartData.totalPrice || 0);

            if (isNaN(itemsPrice) || isNaN(taxPrice) || isNaN(shippingPrice) || isNaN(totalPrice)) {
                setError('Invalid pricing calculation. Please try again.');
                setProcessing(false);
                return;
            }

            if (selectedMethod === 'COD') {
                // Cash on Delivery
                const paymentInfo = {
                    id: 'cod_' + Date.now(),
                    status: 'Pending',
                    method: 'COD'
                };

                await orderAPI.placeOrder({
                    shippingInfo,
                    paymentInfo,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                });
                navigate('/success');
            } else if (selectedMethod === 'UPI') {
                const paymentInfo = {
                    id: 'upi_' + Date.now(),
                    status: 'Pending',
                    method: 'UPI',
                    upiId: upiId // Include UPI ID if provided
                };

                await orderAPI.placeOrder({
                    shippingInfo,
                    paymentInfo,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                });
                navigate('/success');
            }
            setProcessing(false);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. Please try again.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Bad request. Please check your information and try again.');
            } else {
                setError(err.response?.data?.message || err.message || 'Transaction failed. Access denied.');
            }
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
            {/* High-End Progress Stepper */}
            <div className="w-full max-w-2xl mb-16">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -z-10 transform -translate-y-1/2"></div>

                    {[
                        { id: 1, name: 'Logistics', status: 'complete', icon: Truck },
                        { id: 2, name: 'Settlement', status: 'current', icon: ShieldCheck }
                    ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 bg-white px-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${step.status === 'current' ? 'bg-primary text-white shadow-primary/20 scale-110' : step.status === 'complete' ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-text-light'}`}>
                                {step.status === 'complete' ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                            </div>
                            <span className={`text-[0.65rem] font-black uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-primary' : 'text-primary opacity-60'}`}>{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-12"
            >
                {/* Visual Context Sidebar */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                            <Lock className="w-4 h-4" />
                            Payment Options
                        </div>
                        <h1 className="text-4xl font-display text-text-dark tracking-tighter leading-tight">
                            Secure <br /> <span className="text-primary italic">Settlement.</span>
                        </h1>
                        <p className="text-text-light font-medium leading-relaxed">Complete your order with available payment methods.</p>
                    </div>

                    <div className="bg-text-dark text-white p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <Smartphone className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-light backdrop-blur-md">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black tracking-tight leading-none mb-1">Payment Methods</h4>
                                <p className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest">COD & UPI Available</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest">Service Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-green-400">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form Container */}
                <div className="lg:col-span-3">
                    <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 rounded-[3rem] shadow-[0_48px_80px_-32px_rgba(0,0,0,0.1)] relative">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-secondary/5 border border-secondary/10 text-secondary p-4 rounded-2xl text-xs font-bold leading-relaxed flex items-center gap-3"
                                    >
                                        <Info className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Payment Method Selection */}
                            <div className="space-y-4">
                                <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                    Select Payment Method
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setError('Card payments are not available. Please select COD or UPI.')}
                                        className="p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all border-slate-100 opacity-50 cursor-not-allowed"
                                    >
                                        <CreditCard className="w-6 h-6 text-text-light" />
                                        <span className="font-bold text-sm">Credit/Debit Card</span>
                                        <span className="text-xs text-text-light/70">Secure Online Payment</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedMethod('COD')}
                                        className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'}`}
                                    >
                                        <IndianRupee className={`w-6 h-6 ${selectedMethod === 'COD' ? 'text-primary' : 'text-text-light'}`} />
                                        <span className="font-bold text-sm">Cash On Delivery</span>
                                        <span className="text-xs text-text-light/70">Pay at doorstep</span>
                                    </button>
                                </div>
                            </div>

                            {selectedMethod === 'UPI' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <PhoneIcon className="w-3 h-3" /> UPI ID
                                        </label>
                                        <div className="p-4 bg-background-light border border-slate-100 rounded-2xl">
                                            <input
                                                type="text"
                                                placeholder="Enter your UPI ID (e.g., yourname@bank)"
                                                className="w-full bg-transparent text-base font-medium outline-none"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/20 flex items-center justify-center group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-3">
                                        <Loader className="w-6 h-6 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        {selectedMethod === 'COD' && 'Confirm Cash on Delivery'}
                                        {selectedMethod === 'UPI' && 'Confirm UPI Payment'}
                                    </div>
                                )}
                            </motion.button>

                            <p className="text-[0.6rem] text-center font-bold text-text-light/50 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> SECURE PROCESSING
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Payment;
