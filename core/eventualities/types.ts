import type { ObjectId } from "mongodb";
import type {
  ConsequenceRecord,
  DecisionTree,
  EventualityNode,
  ResponsibilityPath,
  ResponsibilityRecord,
  ScenarioOption,
} from "@features/analyze/schemas";

export type EventualityNodeDoc = {
  _id?: ObjectId;
  contributionId: string;
  nodeId: string;
  statementId: string;
  locale: string;
  option: ScenarioOption | null;
  payload: EventualityNode;
  createdAt: Date;
  updatedAt: Date;
};

export type DecisionTreeDoc = {
  _id?: ObjectId;
  contributionId: string;
  treeId: string;
  rootStatementId: string;
  locale: string;
  payload: DecisionTree;
  createdAt: Date;
  updatedAt: Date;
};

export type EventualitySnapshotDoc = {
  _id?: ObjectId;
  contributionId: string;
  locale: string;
  userHash?: string | null;
  userIdMasked?: string | null;
  nodesCount: number;
  treesCount: number;
  consequences?: ConsequenceRecord[];
  responsibilities?: ResponsibilityRecord[];
  responsibilityPaths?: ResponsibilityPath[];
  consequencesCount?: number;
  responsibilitiesCount?: number;
  pathsCount?: number;
  reviewed: boolean;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ImpactSnapshot = {
  contributionId: string;
  locale?: string;
  eventualities: EventualityNode[];
  decisionTrees: DecisionTree[];
  consequences: ConsequenceRecord[];
  responsibilities: ResponsibilityRecord[];
  responsibilityPaths: ResponsibilityPath[];
};
