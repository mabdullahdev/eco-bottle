import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  numReviews: number;
  features: string[];
  specifications: {
    capacity: string;
    material: string;
    dimensions: string;
    weight: string;
    color: string;
  };
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['water-bottles', 'accessories', 'gift-sets']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  features: [{
    type: String
  }],
  specifications: {
    capacity: {
      type: String,
      required: true
    },
    material: {
      type: String,
      required: true
    },
    dimensions: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ isFeatured: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
