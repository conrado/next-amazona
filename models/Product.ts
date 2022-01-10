import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  slug: string;
  image: string;
  name: string;
  price: number;
  category: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
