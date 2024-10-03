import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

// Define the schema
const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    recipeCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<TCategory>('Category', categorySchema);
