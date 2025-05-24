import Cart from '../models/cart.model.js';

export const ensureCartInSession = async (req, res, next) => {
  if (!req.session.cartId) {
    const cart = await Cart.create({ products: [] });
    req.session.cartId = cart._id;
  }
  next();
};
