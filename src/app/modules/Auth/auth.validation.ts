import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const passwordChangeSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(4, 'Old password must be at least 4 characters long'),
    newPassword: z
      .string()
      .min(4, 'New password must be at least 4 characters long')
      .refine((val) => val !== '', 'New password cannot be empty'),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  passwordChangeSchema,
};
