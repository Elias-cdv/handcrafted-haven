import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth.middleware';

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) throw new ApiError('Product not found', 404);

    const existing = await Review.findOne({ product: req.params.productId, author: req.user._id });
    if (existing) throw new ApiError('You have already reviewed this product', 400);

    const review = await Review.create({
      ...req.body,
      product: req.params.productId,
      author: req.user._id,
    });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError('Review not found', 404);
    if (review.author.toString() !== req.user._id.toString()) {
      throw new ApiError('You are not authorized to delete this review', 403);
    }
    await review.deleteOne();
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
