import { z } from 'zod';

const createCommentZodSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: 'Comment content is required',
      })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment is too long'),
    reviewId: z.string({
      required_error: 'Review ID is required',
    }),
  }),
});
const updateCommentZodSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: 'Comment content is required',
      })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment is too long'),
    approved: z.boolean().default(false),
  }),
});

const CommentIDsSchema = z.object({
  body: z.object({
    commentIds: z
      .array(
        z.string({
          required_error: 'Comment ID must be a string',
        }),
      )
      .nonempty('At least one comment ID is required'),
  }),
});

export const CommentsValidation = {
  updateCommentZodSchema,
  createCommentZodSchema,
  CommentIDsSchema,
};
