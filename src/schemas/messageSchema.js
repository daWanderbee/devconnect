import {z} from 'zod';

export const MessageSchema = z.object({
    content: z.string().min(1,{message:"Message must be at least 1 character long"}).max(2000,{message:"Message must be at most 2000 characters long"}),
});