import { IBaseModel } from ".";

export interface IApproverModel extends IBaseModel {
   approverUPN: string;
   creatorUPN: string;
   outcome: string;
   level: number;
   comments: string;
   status: string;
}

export interface IGoalApproverModel extends IApproverModel {
   batchId: string;
   goalId: string;
   approved: boolean;
   requiresReview: boolean;
}

export interface IAppraisalApproverModel extends IApproverModel {
   appraisalId: string;
   goalId: string;
   //requiresReview: boolean;
}