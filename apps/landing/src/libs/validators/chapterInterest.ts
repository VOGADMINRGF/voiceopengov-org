import { z } from "zod";

export const OpeningSlot = z.object({
  day: z.number().min(0).max(6), // 0=So … 6=Sa
  start: z.string(), // "10:00"
  end: z.string(),
});

export const ShippingAddress = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
  street: z.string().optional(),
  postal: z.string().optional(),
  city: z.string().optional(),
  country: z.string().length(2).optional(),
});

export const ChapterInterestSchema = z.object({
  interestType: z.enum(["support", "b2b"]),
  country: z.string().min(2),
  postal: z.string().optional(),
  city: z.string().optional(),
  message: z.string().max(1000).optional(),
  email: z.string().email(),
  bundles: z
    .array(
      z.object({
        key: z.enum(["qr_pdf", "qr_stickers", "table_tent", "tablet_tower"]),
        qty: z.number().int().min(1).max(100).default(1),
      })
    )
    .optional(),
  shipping: ShippingAddress.optional(),
  opening: z.array(OpeningSlot).optional(),
});

export type ChapterInterestInput = z.infer<typeof ChapterInterestSchema>;
