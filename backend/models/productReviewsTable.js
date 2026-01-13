import mongoose from 'mongoose';

const productReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
});

const ProductReview = mongoose.model('ProductReview', productReviewSchema);

export default ProductReview;