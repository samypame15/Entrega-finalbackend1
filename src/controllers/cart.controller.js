
import Cart from '../models/cart.model.js';

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('404', { message: 'Carrito no encontrado' });
    }

    const total = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.render('cartDetail', { cart, total });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).render('500', { message: 'Error al obtener carrito' });
  }
};

// Agregar producto a un carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

// Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};

// Actualizar cantidad de un producto del carrito
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { action } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) {
      return res.status(404).send('Producto no encontrado en el carrito');
    }

    if (action === 'increment') {
      item.quantity += 1;
    } else if (action === 'decrement') {
      item.quantity = Math.max(1, item.quantity - 1);
    } else {
      return res.status(400).send('Acción no válida');
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).send('Error al actualizar cantidad del producto');
  }
};

// Vaciar todos los productos del carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ message: 'Error al vaciar carrito' });
  }
};
