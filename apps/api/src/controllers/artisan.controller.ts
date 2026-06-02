import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth.middleware';

export const getArtisans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const artisans = await User.find({ role: 'artisan' }).select('-password');
    res.status(200).json({ success: true, count: artisans.length, data: artisans });
  } catch (error) {
    next(error);
  }
};

export const getArtisanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const artisan = await User.findOne({ _id: req.params.id, role: 'artisan' }).select('-password');
    if (!artisan) throw new ApiError('Artisan not found', 404);
    const products = await Product.find({ artisan: req.params.id, isAvailable: true });
    res.status(200).json({ success: true, data: { artisan, products } });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bio, story, location, website, socialLinks, specialties } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: { bio, story, location, website, socialLinks, specialties, isVerified: req.user.profile?.isVerified || false } },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
