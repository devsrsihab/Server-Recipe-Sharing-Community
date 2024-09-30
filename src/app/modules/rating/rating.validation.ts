import { z } from 'zod';

// Rating Schema
export const createRatingSchema = z.object({
  body: z.object({ 
  rating: z.number().int().positive('Rating must be a positive integer').min(1).max(5),
})});



export const RatingValidation = {
  createRatingSchema,
};
