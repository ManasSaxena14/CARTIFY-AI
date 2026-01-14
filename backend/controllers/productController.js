import Product from '../models/productTable.js';
import ProductReview from '../models/productReviewsTable.js';
import Order from '../models/ordersTable.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { getAIFilters, getAIRecommendation } from '../utils/aiReport.js';
import mongoose from 'mongoose';

export const createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    user: req.user._id,
    images: req.body.images || []
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const queryObj = {};

  if (req.query.keyword) {
    queryObj.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } }
    ];
  }

  if (req.query.category) {
    queryObj.category = { $regex: req.query.category, $options: 'i' };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) {
      queryObj.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      queryObj.price.$lte = Number(req.query.maxPrice);
    }
  }

  let productsQuery = Product.find(queryObj);

  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * resultPerPage;

  productsQuery = productsQuery.skip(skip).limit(resultPerPage);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    productsQuery = productsQuery.sort(sortBy);
  } else {
    productsQuery = productsQuery.sort('-createdAt');
  }

  const allProducts = await productsQuery.populate('user', 'name email');


  res.status(200).json({
    success: true,
    products: allProducts,
    productsCount,
    resultPerPage,
    currentPage: page,
    totalPages: Math.ceil(productsCount / resultPerPage)
  });
});

export const getSingleProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler('Invalid product ID', 400));
  }

  const product = await Product.findById(id).populate('user', 'name email');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const reviews = await ProductReview.find({ product: id }).populate('user', 'name');

  res.status(200).json({
    success: true,
    data: {
      ...product.toObject(),
      reviews
    }
  });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (price) updateFields.price = price;
  if (category) updateFields.category = category;
  if (stock) updateFields.stock = stock;

  if (req.body.images) {
    updateFields.images = req.body.images;
  }

  product = await Product.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  }).populate('user', 'name email');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }


  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return next(new ErrorHandler('Please provide rating and comment', 400));
  }

  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const userOrders = await Order.find({ user: req.user._id, orderStatus: { $in: ['Shipped', 'Delivered'] } });
  const hasPurchased = userOrders.some(order =>
    order.orderItems.some(item => item.product.toString() === id)
  );

  if (!hasPurchased) {
    return next(new ErrorHandler('You must purchase this product before leaving a review', 400));
  }

  const existingReview = await ProductReview.findOne({
    user: req.user._id,
    product: id
  });

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();

    const reviews = await ProductReview.find({ product: id });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    product.ratings = avgRating;
    product.numOfReviews = reviews.length;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: existingReview
    });
  } else {
    const review = await ProductReview.create({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      product: id
    });

    const reviews = await ProductReview.find({ product: id });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    product.ratings = avgRating;
    product.numOfReviews = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  }
});

export const getDistinctCategories = catchAsyncError(async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    return next(new ErrorHandler('Error fetching categories', 500));
  }
});

export const deleteProductReview = catchAsyncError(async (req, res, next) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const review = await ProductReview.findById(reviewId);
  if (!review) {
    return next(new ErrorHandler('Review not found', 404));
  }

  if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('Not authorized to delete this review', 403));
  }

  await ProductReview.findByIdAndDelete(reviewId);

  const reviews = await ProductReview.find({ product: productId });
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    : 0;

  product.ratings = avgRating;
  product.numOfReviews = reviews.length;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

export const aiRecommendedProducts = catchAsyncError(async (req, res, next) => {
  const { userPrompt } = req.body;

  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
    return next(new ErrorHandler('User prompt is required', 400));
  }

  try {
    const allProducts = await Product.find({});

    const recommendationResult = await getAIRecommendation(userPrompt, allProducts);

    if (!recommendationResult.success) {
      return next(new ErrorHandler(recommendationResult.message || 'Error getting AI recommendations', 500));
    }

    res.status(200).json({
      success: true,
      count: recommendationResult.products.length,
      products: recommendationResult.products
    });
  } catch (error) {
    return next(new ErrorHandler('Error processing AI recommendations', 500));
  }
});

export const aiFilteredProducts = catchAsyncError(async (req, res, next) => {
  const { userQuery } = req.body;

  if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
    return next(new ErrorHandler('User query is required', 400));
  }

  try {
    const filters = await getAIFilters(userQuery);

    let query = {};

    if (filters.keyword && filters.keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } },
        { category: { $regex: filters.keyword, $options: 'i' } }
      ];
    }

    if (filters.category && filters.category.trim() !== '') {
      if (query.$or) {
        query.category = { $regex: filters.category, $options: 'i' };
      } else {
        query.category = filters.category;
      }
    }

    if (filters.minPrice > 0 || filters.maxPrice > 0) {
      query.price = {};
      if (filters.minPrice > 0) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice > 0) {
        query.price.$lte = filters.maxPrice;
      }
    }

    if (filters.minRating > 0) {
      query.ratings = { $gte: filters.minRating };
    }

    let sortOptions = {};
    if (filters.sortBy && filters.sortBy.trim() !== '') {
      switch (filters.sortBy.toLowerCase()) {
        case 'price':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { ratings: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return next(new ErrorHandler('Error processing AI query', 500));
  }
});
