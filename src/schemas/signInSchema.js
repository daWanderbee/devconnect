import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z.string(), // Change identifier to username
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  });
  