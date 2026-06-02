import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: { url: string; alt: string; isPrimary: boolean }[];
  artisan: mongoose.Types.ObjectId;
  stock: number;
  isAvailable: boolean;
  averageRating: number;
  reviewCount: number;
  materials: string[];
  customizable: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 3000 },
    price: { type: Number, required: [true, 'Price is required'], min: 0.01 },
    category: { type: String, required: true, enum: ['ceramics','jewelry','textiles','woodwork','painting','glasswork','leatherwork','candles','other'] },
    tags: [{ type: String, lowercase: true }],
    images: [{ url: { type: String, required: true }, alt: { type: String, required: true }, isPrimary: { type: Boolean, default: false } }],
    artisan: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: Number, default: 1, min: 0 },
    isAvailable: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    materials: [{ type: String }],
    customizable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ artisan: 1 });
ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
