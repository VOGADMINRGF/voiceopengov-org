import { z } from "zod";


export const NewsletterSchema = z.object({
email: z.string().email().max(320)
});
export type NewsletterInput = z.infer<typeof NewsletterSchema>;