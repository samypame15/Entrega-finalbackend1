import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/products.controller.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', validateObjectId, getProductById);

export default router;

