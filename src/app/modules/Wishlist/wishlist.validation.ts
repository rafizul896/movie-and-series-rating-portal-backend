import { z } from 'zod';

const createWatchlistSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .uuid({ message: 'Invalid userId format. Must be a UUID.' }),
    movieId: z
      .string()
      .uuid({ message: 'Invalid movieId format. Must be a UUID.' }),
  }),
});

export const WatchlistValidation = {
  createWatchlistSchema,
};
