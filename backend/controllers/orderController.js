import Order from '../models/ordersTable.js';
import Product from '../models/productTable.js';
import Cart from '../models/cartTable.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { generatePaymentIntent } from '../utils/generatePaymentIntent.js';

export const createPaymentIntent = catchAsyncError(async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler('Cart is empty', 400));
        }

        let totalAmount = 0;
        cart.items.forEach(item => {
            const itemPrice = Number(item.price) || 0;
            const itemQuantity = Number(item.quantity) || 0;
            totalAmount += itemPrice * itemQuantity;
        });

        if (totalAmount <= 0) {
            return next(new ErrorHandler('Invalid cart total amount', 400));
        }

        const amountInPaise = Math.round(totalAmount * 100);

        if (amountInPaise <= 0) {
            return next(new ErrorHandler('Invalid payment amount', 400));
        }

        const result = await generatePaymentIntent(amountInPaise);

        res.status(200).json({
            success: true,
            client_secret: result.client_secret,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Payment intent creation failed', 500));
    }
});

export const placeOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (!paymentInfo.method || !['Stripe', 'COD', 'UPI'].includes(paymentInfo.method)) {
        return next(new ErrorHandler('Invalid payment method', 400));
    }

    let paymentStatus = paymentInfo.status;
    if (['COD', 'UPI'].includes(paymentInfo.method)) {
        paymentStatus = 'Pending';
    }

    if (paymentInfo.method === 'Stripe' && !paymentInfo.id) {
        return next(new ErrorHandler('Payment ID is required for Stripe payments', 400));
    }

    const validatedItemsPrice = Number(itemsPrice) || 0;
    const validatedTaxPrice = Number(taxPrice) || 0;
    const validatedShippingPrice = Number(shippingPrice) || 0;
    const validatedTotalPrice = Number(totalPrice) || 0;

    if (validatedItemsPrice < 0 || validatedTaxPrice < 0 || validatedShippingPrice < 0 || validatedTotalPrice < 0) {
        return next(new ErrorHandler('Invalid pricing information', 400));
    }

    const expectedTotal = Number((validatedItemsPrice + validatedTaxPrice + validatedShippingPrice).toFixed(2));
    if (Math.abs(validatedTotalPrice - expectedTotal) > 0.01) {
        return next(new ErrorHandler('Invalid total price calculation', 400));
    }

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!populatedCart || populatedCart.items.length === 0) {
        return next(new ErrorHandler('Cart is empty', 400));
    }

    const finalOrderItems = populatedCart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images && item.product.images[0] ? item.product.images[0].url : "",
    }));

    // Verify stock availability first
    for (const item of finalOrderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity) {
            return next(new ErrorHandler(`Product ${product ? product.name : 'Unknown'} is out of stock`, 400));
        }
    }

    let paidAtDate = Date.now();
    if (['COD', 'UPI'].includes(paymentInfo.method)) {
        paidAtDate = null;
    }

    const order = await Order.create({
        shippingInfo,
        orderItems: finalOrderItems,
        paymentInfo: {
            id: paymentInfo.id || '',
            status: paymentStatus,
            method: paymentInfo.method
        },
        itemsPrice: validatedItemsPrice,
        taxPrice: validatedTaxPrice,
        shippingPrice: validatedShippingPrice,
        totalPrice: validatedTotalPrice,
        paidAt: paidAtDate,
        user: req.user._id,
    });

    // Update stock safely
    for (const item of finalOrderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
        success: true,
        order,
    });
});

export const myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });
});

export const getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('Order not found with this Id', 404));
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('Not authorized to view this order', 403));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


export const getAllOrdersAdmin = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found with this Id', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully'
    });
});

export const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found with this Id', 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});
