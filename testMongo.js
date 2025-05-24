import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log('✅ Conexión a MongoDB exitosa');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
  }
};

testConnection();
