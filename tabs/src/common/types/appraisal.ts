import { IBaseModel, IDateRange } from ".";

export interface IAppraisalModel extends IBaseModel {
   appraisalPeriodId: string; // PartitionKey
   status: string,//submitted | approver1 | approver2 | approver3 | revising | appraisalAssigned
   overallResult: number,
   allApproversUPN: string[],
   currentApproverUPN: string,
   creatorUPN: string,
   currentLevel: number,
   totalLevels: number,
}