import User from '../models/userTable.js';
import Product from '../models/productTable.js';
import Order from '../models/ordersTable.js';
import ProductReview from '../models/productReviewsTable.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { generateAIReport } from '../utils/aiReport.js';

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

export const getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const { role } = req.body;

    if (req.params.id === req.user.id && role !== 'admin') {
        return next(new ErrorHandler('You cannot demote yourself from admin', 400));
    }

    const newUserData = {
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully"
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (req.params.id === req.user.id) {
        return next(new ErrorHandler('You cannot delete your own account', 400));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});


export const getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});

export const getLowStockProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 });

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});

export const getAllReviews = catchAsyncError(async (req, res, next) => {
    const reviews = await ProductReview.find()
        .populate('user', 'name email')
        .populate('product', 'name');

    const formattedReviews = reviews.map(review => ({
        _id: review._id,
        user: review.user,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        product: review.product,
        productName: review.product.name,
        productId: review.product._id,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    }));

    res.status(200).json({
        success: true,
        count: formattedReviews.length,
        reviews: formattedReviews
    });
});

export const deleteReview = catchAsyncError(async (req, res, next) => {
    const { productId, reviewId } = req.params;

    const review = await ProductReview.findById(reviewId);

    if (!review) {
        return next(new ErrorHandler("Review not found", 404));
    }

    if (review.product.toString() !== productId) {
        return next(new ErrorHandler("Review does not belong to this product", 400));
    }

    await ProductReview.findByIdAndDelete(reviewId);

    const remainingReviews = await ProductReview.find({ product: productId });

    let avgRating = 0;
    if (remainingReviews.length > 0) {
        avgRating = remainingReviews.reduce((acc, item) => item.rating + acc, 0) / remainingReviews.length;
    }

    const numOfReviews = remainingReviews.length;

    await Product.findByIdAndUpdate(productId, {
        ratings: avgRating,
        numOfReviews: numOfReviews
    });

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});


export const dashboardStats = catchAsyncError(async (req, res, next) => {
    const totalRevenueResult = await Order.aggregate([
        { $match: { paidAt: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const orderStatusCounts = {
        processing: 0,
        shipped: 0,
        delivered: 0
    };

    orders.forEach(order => {
        const statusKey = order.orderStatus.toLowerCase();
        if (orderStatusCounts[statusKey] !== undefined) {
            orderStatusCounts[statusKey]++;
        }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueTrendsResult = await Order.aggregate([
        { $match: { paidAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                revenue: { $sum: "$totalPrice" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Zero-pad missing days in the last 7 days
    const trends = [];
    const trendMap = new Map(revenueTrendsResult.map(item => [item._id, item]));

    for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        if (trendMap.has(dateStr)) {
            trends.push(trendMap.get(dateStr));
        } else {
            trends.push({ _id: dateStr, revenue: 0, orders: 0 });
        }
    }

    const topProducts = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: "$orderItems.product",
                name: { $first: "$orderItems.name" },
                sold: { $sum: "$orderItems.quantity" },
                revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            }
        },
        { $sort: { sold: -1 } },
        { $limit: 5 }
    ]);

    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });

    res.status(200).json({
        success: true,
        stats: {
            users: totalUsers,
            products: totalProducts,
            orders: totalOrders,
            revenue: totalRevenue,
            orderStatus: orderStatusCounts,
            trends: trends,
            topProducts,
            lowStock
        }
    });
});

export const exportAIReport = catchAsyncError(async (req, res, next) => {
    const totalRevenueResult = await Order.aggregate([
        { $match: { paidAt: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const lowStock = await Product.find({ stock: { $lte: 5 } }).select('name stock');

    const topProductsResult = await Order.aggregate([
        { $match: { paidAt: { $ne: null } } },
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: "$orderItems.product",
                name: { $first: "$orderItems.name" },
                sold: { $sum: "$orderItems.quantity" }
            }
        },
        { $sort: { sold: -1 } },
        { $limit: 5 }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenueResult = await Order.aggregate([
        { $match: { paidAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlySalesResult = await Order.aggregate([
        { $match: { paidAt: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const monthlySales = monthlySalesResult.length > 0 ? monthlySalesResult[0].total : 0;

    const stats = {
        totalRevenue,
        totalUsers,
        totalProducts,
        totalOrders,
        monthlySales,
        todayRevenue,
        topProducts: topProductsResult,
        lowStock
    };

    const aiReport = await generateAIReport(stats);

    res.status(200).json({
        success: true,
        report: aiReport
    });
});
