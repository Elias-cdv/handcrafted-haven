import { Router } from 'express';
import { getArtisans, getArtisanById, updateMyProfile } from '../controllers/artisan.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getArtisans);
router.get('/:id', getArtisanById);
router.patch('/me/profile', protect, restrictTo('artisan'), updateMyProfile);

export default router;
