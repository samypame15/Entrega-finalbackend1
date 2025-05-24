import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: Number, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  status: { type: Boolean, default: true },
  thumbnail: { type: String },
  tags: [{ type: String }]
}, {
  timestamps: true
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema);
