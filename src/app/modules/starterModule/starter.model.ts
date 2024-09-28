import { Schema, model } from 'mongoose';
import { TInterface } from './starter.interface';

const modelSchema = new Schema<TInterface>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

// make model
export const ModelSchema = model<TInterface>('ModelSchema', modelSchema);
