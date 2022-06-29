export interface IGoalBatchAPIModel {
   appraisaltitle: {
      id: number;
      empfk: number;
      appraisalPeriodfk: number;
      title: string;
      status: string;
      datecreated: string;
      timecreated: string;
      performanceManagementStage: string;
   }[];
   status: string;
   message: string;
}

export interface IGoalBatchListAPIModel {
   appraisaltitle: {
      id: number;
      empfk: number;
      appraisalPeriodfk: number;
      title: string;
      status: string;
      datecreated: string;
      timecreated: string;
      performanceManagementStage: string;
   }[];
   status: string;
   message: string;
}

export interface IGoalBatchSearchModel {
   userId: number;
   appraisalPeriodId: number;
}

export interface IGoalBatchItemReviewModel { 
   kraTitle: string, 
   kraId: number, 
   goalId: number, 
   approved: boolean 
}

export interface IGoalBatchApproveModel {
   id: number;
   approverId: number;
   approved: boolean;
   comments: string;
}

export interface IGoalBatchModel {
   id: number;
   title: string;
   status: string;
   userId: number;
   currentLevel: number;
   appraisalPeriodId: number;
   createdTimestamp: number;
}

export interface IGoalBatchItemModel {
   userId: number;
   userDisplayName?: string; // bug, we need this or the upn
   id: number;
   kraId?: number;
   kraTitle: string;
   timing: string;
   weight: number;
   priority: number;
   createdTimestamp: number;
   description: string;
   measureOfSuccess: string;
   achievementCriteria: string;
   batchId: number;
}

export const newGoalBatch: IGoalBatchModel = {
   id: 0,
   title: "",
   status: "",
   userId: 0,
   currentLevel: 0,
   appraisalPeriodId: 0,
   createdTimestamp: 0
}