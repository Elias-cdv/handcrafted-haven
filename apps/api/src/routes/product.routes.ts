import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, restrictTo('artisan', 'admin'), createProduct);
router.put('/:id', protect, restrictTo('artisan', 'admin'), updateProduct);
router.delete('/:id', protect, restrictTo('artisan', 'admin'), deleteProduct);

export default router;
