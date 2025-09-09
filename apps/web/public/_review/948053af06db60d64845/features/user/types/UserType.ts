import { GamificationStats } from "../../contribution/types/GamificationStats";

export interface UserProfile {
  _id?: string;
  roles: ('user' | 'scout' | 'moderator' | 'kurator' | 'redaktion' | 'gast')[];
  xpStats: { [topic: string]: number };
  badgeIds?: string[];
  activityFeed?: UserActivity[];
  region?: {
    country?: string;
    state?: string;
    district?: string;
    municipality?: string;
    politicalAreaId?: string;
  };
  ageGroup?: '16-25' | '26-35' | '36-45' | '46-60' | '60+';
  profession?: string;
  educationLevel?: string;
  gender?: string;
  profileVerified?: boolean;
  payrollGroup?: string;
  department?: string;
  expectedTendency?: string;
  votingHistory?: string[];
  gamificationStats?: GamificationStats;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
  deleted?: boolean;
  version?: number;
}
