import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/product/:productId', getReviews);
router.post('/product/:productId', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
