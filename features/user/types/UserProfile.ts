export type RoleObject = {
  role: "user" | "citizen" | "moderator" | "admin" | "superadmin" | "b2b" | "ngo" | "politics" | "party";
  subRole?: string;
  orgId?: string;
  orgName?: string;
  region?: string;
  verification?: "none" | "verified" | "legitimized";
  premium?: boolean;
};

export interface IUserProfile {
  _id?: string;
  id?: string;
  username: string;
  email?: string;
  roles: RoleObject[];
  activeRole: number;
  trustScore: number;
  badges: string[];
  interests: string[];
  regions: string[];
  languages: string[];
  status: "active" | "banned" | "pending";
  region?: string;
  city?: string;
  premium: boolean;
  verification: "none" | "verified" | "legitimized";
  onboardingStatus: "incomplete" | "pendingDocs" | "complete";
  auditTrail: { date: Date; action: string; details: any }[];
  limits?: any;
  quickLogin?: boolean;
  eventRef?: string;
  questionRef?: string;
  votedStatements?: string[];
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  lastMfaChallengeAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  username_lc?: string;
}
