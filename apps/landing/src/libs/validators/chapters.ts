import { z } from "zod";


export const ChapterIntentEnum = z.enum(["join", "found"]);


export const ChapterLeadSchema = z.object({
email: z.string().email().max(320),
countryCode: z.string().min(2).max(2),
postal: z.string().min(3).max(10).optional(),
city: z.string().min(2).max(120).optional(),
locale: z.string().min(2).max(5).optional(),
intent: ChapterIntentEnum.default("found"),
message: z.string().max(2000).optional()
});
export type ChapterLeadInput = z.infer<typeof ChapterLeadSchema>;