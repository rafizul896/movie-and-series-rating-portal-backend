import { z } from 'zod';

const addReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(10, 'Rating must be between 1 and 10'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).optional(),
    hasSpoiler: z.boolean().optional(),
    userId: z.string().uuid(),
    movieId: z.string().uuid(),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(10, 'Rating must be between 1 and 10').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    tags: z.array(z.string()).optional(),
    hasSpoiler: z.boolean().optional()
  }),
});

export const reviewValidation = {
  addReviewSchema,
  updateReviewSchema
};
