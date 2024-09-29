import { model, Schema } from 'mongoose';
import { IIngredient, IRecipe } from './recipe.interface';

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
      trim: true
    }, 
   description: {
    type: String,
    required: [true, 'description is required'],
    trim: true
   } ,
  ingredients: {
    type: [ingredientSchema] ,
    required: [true, 'ingredients is required'],
    trim: true
  } ,
  instructions: {
    type: String,
    required: [true, 'instructions is required'],
  } ,
  category: {
    type: String,
    required: [true, 'category is required'],
    trim: true
  } ,
  prepTime: {
    type: Number,
    required: [true, 'prep time is required'],
    trim: true
  } ,
  cookTime: {
    type: Number,
    required: [true, 'cook time is required'],
    trim: true
  } ,
  upvotes: {
    type: Number,
    default: 0
  } ,
  downvotes: {
      type: Number,
      default: 0
    },
  createdBy: {
    type: Schema.Types.ObjectId,  // Reference to the User model
    ref: 'User',
    required: [true, 'Created by is required']
  },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
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
