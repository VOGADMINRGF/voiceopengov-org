import { z } from "zod";
import { ORG_ROLES, ORG_MEMBERSHIP_STATUSES } from "./types";

export const OrgRoleSchema = z.enum(ORG_ROLES);
export const OrgMembershipStatusSchema = z.enum(ORG_MEMBERSHIP_STATUSES);

export const OrgCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(60).optional(),
});

export const OrgPatchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  archivedAt: z.string().datetime().nullable().optional(),
});

export const OrgInviteSchema = z.object({
  email: z.string().email(),
  role: OrgRoleSchema,
});

export const OrgMemberPatchSchema = z.object({
  role: OrgRoleSchema.optional(),
  status: OrgMembershipStatusSchema.optional(),
});

export const OrgMemberDisableSchema = z.object({
  reason: z.string().min(3).optional(),
});
