import { z } from "zod";


export const ContactSchema = z.object({
name: z.string().min(2).max(160),
email: z.string().email().max(320),
message: z.string().min(10).max(4000),
topic: z.string().max(120).optional()
});
export type ContactInput = z.infer<typeof ContactSchema>;