import Cart from '../models/cartTable.js';
import Product from '../models/productTable.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const addToCart = catchAsyncError(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new ErrorHandler('Product ID is required', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{
        product: productId,
        quantity: quantity,
        price: product.price
      }],
      totalPrice: product.price * quantity
    });
  } else {
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
      }
      
      existingItem.quantity = newQuantity;
      existingItem.price = product.price; 
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();
  }

  await cart.populate('items.product', 'name price images');

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    data: cart
  });
});

export const getMyCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images');

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: {
        items: [],
        totalPrice: 0
      }
    });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

export const updateCartItemQuantity = catchAsyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return next(new ErrorHandler('Product ID and quantity are required', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler('Item not found in cart', 404));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    if (product.stock < quantity) {
      return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price; 
  }

  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  await cart.save();

  await cart.populate('items.product', 'name price images');

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: cart
  });
});

export const removeItemFromCart = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler('Item not found in cart', 404));
  }

  cart.items.splice(itemIndex, 1);

  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    data: cart
  });
});

export const clearCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: cart
  });
});