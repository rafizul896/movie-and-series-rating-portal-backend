import { z } from 'zod';

export const addMovieSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    synopsis: z.string({ message: 'Synopsis is required' }),
    genres: z.array(z.string({ message: 'Genre must be a string' }), {
      message: 'Genres are required',
    }),
    type: z
      .enum(['MOVIE', 'SERIES'], {
        message: 'Type must be either MOVIE or SERIES',
      })
      .default('MOVIE'),
    releaseYear: z.number({ message: 'Release year must be a number' }),
    director: z.string({ message: 'Director name is required' }),
    cast: z.array(z.string({ message: 'Cast name must be a string' }), {
      message: 'Cast list is required',
    }),
    platforms: z.array(z.string({ message: 'Platform must be a string' }), {
      message: 'Platforms are required',
    }),
    buyPrice: z.number({ message: 'Buy price must be a number' }),
    rentPrice: z.number({ message: 'Rent price must be a number' }),
    discountPrice: z
      .number({ message: 'Discount price must be a number' })
      .optional(),
    // thumbnail: z.string({ message: 'Thumbnail is required' }),
    streamingLink: z.string({ message: 'Streaming link is required' }),
    isTrending: z
      .boolean({ message: 'isTrending must be true or false' })
      .default(false),
  }),
});

export const updateMovieSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    synopsis: z.string().optional(),
    genres: z.array(z.string()).optional(),
    type: z.enum(['MOVIE', 'SERIES']).optional(),
    releaseYear: z.number().optional(),
    isDeleted: z.boolean().optional(),
    director: z.string().optional(),
    cast: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional(),
    buyPrice: z.number().optional(),
    rentPrice: z.number().optional(),
    discountPrice: z.number().optional(),
    thumbnail: z.string().optional(),
    streamingLink: z.string().optional(),
    isTrending: z.boolean().optional(),
  }),
});

export const MovieValidation = {
  addMovieSchema,
  updateMovieSchema
};
