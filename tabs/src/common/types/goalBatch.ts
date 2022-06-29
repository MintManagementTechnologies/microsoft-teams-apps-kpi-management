import { IBaseModel } from ".";

export interface IGoalBatchModel extends IBaseModel {
   appraisalPeriodId: string; // PartitionKey
   status: string; //submitted | approver1 | approver2 | approver3 | revising | appraisalAssigned
   allApproversUPN: string[];
   currentApproverUPN: string;
   creatorUPN: string;
   currentLevel: number;
   totalLevels: number;
   comments: string;
   meetingInitiated: boolean;
   conversationStarted: boolean;
   goalIds?: string[];
}