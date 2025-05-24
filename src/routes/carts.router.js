
import { Router } from 'express';
import {
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantity,
  clearCart
} from '../controllers/cart.controller.js';

import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

router.param('cid', validateObjectId('cid'));
router.param('pid', validateObjectId('pid'));

router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid/products/:pid', updateProductQuantity);

router.get('/:cid', getCartById);
router.delete('/:cid', clearCart);

export default router;
