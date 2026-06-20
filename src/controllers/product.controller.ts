import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, search, artisan, page = 1, limit = 12 } = req.query;
    const filter: any = {};

    if (!artisan) filter.isAvailable = true;
    if (category) filter.category = category;
    if (artisan) filter.artisan = artisan;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search as string };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('artisan', 'name avatar profile.location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('artisan', 'name avatar profile');
    if (!product) throw new ApiError('Product not found', 404);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.create({ ...req.body, artisan: req.user._id });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError('Product not found', 404);
    if (product.artisan.toString() !== req.user._id.toString()) {
      throw new ApiError('You are not authorized to update this product', 403);
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError('Product not found', 404);
    if (product.artisan.toString() !== req.user._id.toString()) {
      throw new ApiError('You are not authorized to delete this product', 403);
    }
    await product.deleteOne();
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
