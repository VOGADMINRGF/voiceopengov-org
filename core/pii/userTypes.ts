import { z } from "zod";

export const piiUserSchema = z.object({
  personal: z
    .object({
      givenName: z.string().trim().optional(),
      familyName: z.string().trim().optional(),
      fullName: z.string().trim().optional(),
      yearOfBirth: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
      birthDate: z.string().trim().optional(),
      city: z.string().trim().optional(),
      profession: z.string().trim().optional(),
      title: z.string().trim().optional(),
      pronouns: z.string().trim().optional(),
    })
    .optional(),
  contacts: z.object({
    emailPrimary: z.string().email(),
    phone: z.string().trim().optional(),
  }),
  bank: z
    .object({
      // Placeholder for existing PaymentProfile shape / reference
    })
    .passthrough()
    .optional(),
  address: z
    .object({
      street: z.string().trim().optional(),
      postalCode: z.string().trim().optional(),
      city: z.string().trim().optional(),
      country: z.string().trim().optional(),
    })
    .optional(),
  flags: z
    .object({
      hasVerifiedBankProfile: z.boolean().optional(),
    })
    .optional(),
});

export type PiiUser = z.infer<typeof piiUserSchema>;
