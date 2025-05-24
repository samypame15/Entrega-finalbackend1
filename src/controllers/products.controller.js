import Product from '../models/product.model.js';

// GET /api/products?limit=&page=&sort=&query=
export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort; // 'asc' or 'desc'
    const query = req.query.query;

    let filter = {};
    if (query) {
      if (query === 'true' || query === 'false') filter.status = query === 'true';
      else filter.category = query;
    }

    const options = { page, limit, lean: true };
    if (sort === 'asc') options.sort = { price: 1 };
    else if (sort === 'desc') options.sort = { price: -1 };

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/products/:pid
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
