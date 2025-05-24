
import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const router = express.Router();

// Redirección a /products
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Vista con listado paginado de productos
router.get('/products', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Product.paginate({}, {
      page,
      limit,
      lean: true,
      sort: { title: 1 }
    });

    res.render('products', {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      cartId: req.session.cartId || null
    });

  } catch (error) {
    console.error('🛑 Error al cargar productos:', error);
    next(error);
  }
});

// Vista detalle del producto
router.get('/products/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).render('404', { message: 'ID de producto inválido' });
    }

    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).render('404', { message: 'Producto no encontrado' });
    }

    res.render('productDetail', {
      product,
      cartId: req.session.cartId || null
    });
  } catch (error) {
    console.error('🛑 Error al cargar detalle del producto:', error);
    next(error);
  }
});

// Vista carrito con productos en sesión
router.get('/cart', async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      return res.render('cart', { cart: null, total: 0, empty: true });
    }

    const cart = await Cart.findById(req.session.cartId).populate('products.product').lean();

    if (!cart) {
      return res.render('cart', { cart: null, total: 0, empty: true });
    }

    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.render('cart', {
      cart,
      total,
      empty: cart.products.length === 0
    });

  } catch (error) {
    console.error('🛑 Error al cargar el carrito:', error);
    next(error);
  }
});


router.get('/carts/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).render('404', { message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('404', { message: 'Carrito no encontrado' });
    }

    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.render('cart', {
      cart,
      total,
      empty: cart.products.length === 0
    });

  } catch (error) {
    console.error('🛑 Error al cargar carrito por ID:', error);
    next(error);
  }
});

export default router;
