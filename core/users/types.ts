import type { ObjectId } from "mongodb";
import type { UserVerification } from "@core/auth/verificationTypes";
import type { UserRole } from "@/types/user";
import type { AccessTier } from "@core/access/accessTiers";

export type CoreAccessTier = AccessTier;

export type CoreUserProfile = {
  displayName?: string | null;
  locale?: string | null;
  location?: string | null;
  headline?: string | null;
  bio?: string | null;
  avatarStyle?: "initials" | "abstract" | "emoji" | null;
  topTopics?: Array<{
    key?: string;
    title?: string;
    statement?: string | null;
  }>;
  publicFlags?: {
    showRealName?: boolean;
    showCity?: boolean;
    showJoinDate?: boolean;
    showEngagementLevel?: boolean;
    showStats?: boolean;
  };
};

export type CoreUserSettings = {
  preferredLocale?: string | null;
  newsletterOptIn?: boolean;
};

export type CoreUserDoc = {
  _id: ObjectId;
  email: string;
  name?: string | null;
  role?: string | null;
  roles?: UserRole[];
  accessTier?: CoreAccessTier;
  profile?: CoreUserProfile;
  settings?: CoreUserSettings;
  verification?: UserVerification;
  verifiedEmail?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
