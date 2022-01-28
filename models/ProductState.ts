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
