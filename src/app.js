
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import methodOverride from 'method-override';

import { create } from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import connectDB from './config/db.js';

import { helpers } from './utils/helper.js';
import { ensureCartInSession } from './middlewares/cartSession.js'; // ✅ nuevo middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// method-override para PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Configurar sesiones
app.use(session({
  secret: 'mi-secreto-super-seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 }
}));

// ✅ Middleware para asegurar carrito en sesión (en todas las rutas)
app.use(ensureCartInSession);

// ✅ Middleware para exponer cartId en todas las vistas
app.use((req, res, next) => {
  res.locals.cartId = req.session.cartId;
  next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Configuración Handlebars con helpers
const hbs = create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers,
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Verificar URI MongoDB
if (!process.env.URI_MONGODB) {
  console.error('❌ URI_MONGODB no está definida en el archivo .env');
  process.exit(1);
}

// Conectar DB y levantar servidor
connectDB().then(() => {
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/', viewsRouter);

  app.use((req, res) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error conectando a la base de datos:', err);
  process.exit(1);
});
