import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
