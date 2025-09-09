import { FactBoxEntry } from "./FactBoxEntry";
import { GamificationStats } from "./GamificationStats";
import { ModAction } from "../../common/types/ModAction";
import { QRCodeEntry } from "./QRCodeEntry";
import { FeedReference } from "./FeedReference";
import { PoliticalArea } from "./PoliticalArea";

export type ContributionStatus = 'offen' | 'geschlossen' | 'review' | 'archiviert';

export interface Contribution {
  _id?: string;
  authorIds: string[];                   // Haupt- & Co-Autoren (User-IDs)
  title: string;
  summary?: string;
  content: string;
  topicTags: string[];
  region: PoliticalArea;
  language: string;
  media?: {
    image?: string;
    video?: string;
    externalLink?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  status: ContributionStatus;
  roles: { [userId: string]: 'autor' | 'coautor' | 'redaktion' | 'kurator' | 'gast' };
  relatedContributionIds?: string[];
  externalSource?: {
    name: string;
    url: string;
    reviewStatus: 'geprüft' | 'unbestätigt' | 'umstritten' | 'fehlt';
    tendency?: string;
  };
  factsBox?: FactBoxEntry[];
  reportId?: string;
  engagementStats: {
    votes: number;
    swipes: number;
    follows: number;
    bookmarks: number;
    shares: number;
    trending: boolean;
  };
  gamificationStats?: GamificationStats;
  modLog?: ModAction[];
  feedReferences?: FeedReference[];
  isInfoOnly?: boolean;
  parentContributionId?: string;
  commentsEnabled?: boolean;
  politicalTendency?: string;                 // KI-/Redaktions-Tendenz
  qrCodes?: QRCodeEntry[];
  demographicStats?: { [key: string]: number };
  statementIds?: string[];
  organizationId?: string;
  archived?: boolean;
  deleted?: boolean;
  version?: number;
}
 