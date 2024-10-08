import { model, Schema } from 'mongoose';
import { IIngredient, IRecipe } from './recipe.interface';
import { recipeStatus } from './recipe.constant';

// username schema
const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: [true, 'ingredient name is required'],
    trim: true,
  },
  quantity: {
    type: String,
    trim: true,
  },
});

// recipe schema
const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true,
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, 'ingredients is required'],
      trim: true,
    },
    instructions: {
      type: String,
      required: [true, 'instructions is required'],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    image: {
      type: String,
      default: 'https://placehold.co/600x400/png',
    },
    prepTime: {
      type: Number,
      required: [true, 'prep time is required'],
      trim: true,
    },
    cookTime: {
      type: Number,
      required: [true, 'cook time is required'],
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: [Schema.Types.ObjectId],
      ref: 'Rating',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
    upvotedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    downvotedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: recipeStatus,
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// query middleware show only where isDelete false
recipeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlware for findone
recipeSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// aggregate middleware
recipeSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

// recipe model
export const Recipe = model<IRecipe>('Recipe', recipeSchema);
