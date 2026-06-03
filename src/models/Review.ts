import mongoose, { Document, Schema } from 'mongoose';
import Product from './Product';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    title: { type: String, required: [true, 'Title is required'], maxlength: 100 },
    body: { type: String, required: [true, 'Body is required'], maxlength: 1500 },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, author: 1 }, { unique: true });

ReviewSchema.statics.calcAverageRating = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { averageRating: 0, reviewCount: 0 });
  }
};

ReviewSchema.post('save', function () {
  (this.constructor as any).calcAverageRating(this.product);
});

ReviewSchema.post('deleteOne', { document: true }, function () {
  (this.constructor as any).calcAverageRating(this.product);
});

export default mongoose.model<IReview>('Review', ReviewSchema);
