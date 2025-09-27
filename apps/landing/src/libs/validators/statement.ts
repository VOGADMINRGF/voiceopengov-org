import { z } from "zod";


export const StatementCreateSchema = z.object({
title: z.string().min(5).max(140),
summary: z.string().max(240).optional(),
body: z.string().min(20),
tags: z.array(z.string()).max(12).default([]),
locale: z.string().min(2).max(5).default("de"),
regionCode: z.string().max(24).optional(),
authorEmail: z.string().email().optional(),
});


export type StatementCreateInput = z.infer<typeof StatementCreateSchema>;