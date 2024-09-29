import { z } from 'zod';

// Ingredient Schema
const ingredientSchema = z.object({
  name: z.string().trim().nonempty('Ingredient name is required'),
  quantity: z.string().trim().optional(),
});

// Recipe Schema
export const createRecipeSchema = z.object({
  body: z.object({ 
  title: z.string().trim().nonempty('Title is required'),
  description: z.string().trim().nonempty('Description is required'),
  ingredients: z.array(ingredientSchema).nonempty('At least one ingredient is required'),
  instructions: z.string().nonempty('Instructions are required'),
  category: z.string().trim().nonempty('Category is required'),
  prepTime: z.number().int().positive('Prep time must be a positive integer'),
  cookTime: z.number().int().positive('Cook time must be a positive integer'),

})});

// Recipe Update Schema
export const updateRecipeSchema = z.object({
 body: createRecipeSchema.partial(),
});

export const RecipeValidation = {
  createRecipeSchema,
  updateRecipeSchema,
};
