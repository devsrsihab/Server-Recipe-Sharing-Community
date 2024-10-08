import { Types } from 'mongoose';
import { z } from 'zod';

// Rating Schema
export const createCommentSchema = z.object({
  body: z.object({
    recipeId: z
      .string()
      .nonempty('Recipe id is required')
      .refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid recipe id',
      }),
    comment: z.string().nonempty('Text is required').min(1, 'Text must be at least 1 character'),
  }),
});

export const CommentValidation = {
  createCommentSchema,
};
