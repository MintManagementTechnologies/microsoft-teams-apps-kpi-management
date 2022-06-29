/* RS: Note there are 3 different spellings for Appraisal throughout the API:
 - Appraisal​
 - Appriasal
 - Apprasail */

// RS: Incorrect spelling of method name and inconsistent use of casing in parameters for API call: /api​/Appraisal​/GetGoalForAppriasal​/{goalId}​/{employeeid}
// RS: Incorrect spelling of method name for API call: /api/Appraisal/GetGoalListForAppriasal/{employeeId}/{appraisalTitleId}
// RS: Would an appriasal not be linked to an employee Id, making that parameter redundant?
// RS: Inconsistent casing throughout property names
// RS: The same model is used for the list method, so passing unnecessary data in both calls...

export interface IAppraisalGoalItemAPIModel {
   id: number,
   keyresultareafk: number,
   keyresultarea: string,
   actualresultSelf: string,
   actualresultManager: string, // RS: manager 1 or 2?
   decription: string, // RS: Spelling mistake
   measureofsuccess: string,
   timing: string,
   weight: number,
   achievementcriteria: string,
   datecreated: string,
   timecreated: string,
   createdby: number,
   priority: number,
   appraisalTitleId: number,
   empfk: number,
}

export interface IAppraisalAPIModel {
   status: string;
   message: string;
   goal: IAppraisalGoalItemAPIModel;
   goalList: IAppraisalGoalItemAPIModel[]
}

// RS: Incorrect spelling of paramter name for API call: /api/Appraisal/GetGoalDevelopmentArea/{apprasailTitleId}
// RS: Inconsistent casing throughout property names
export interface IGoalDevelopmentAreaAPIModel {
   status: string;
   message: string;
   developmentArea: {
      id: number,
      appraisalfk: string, // RS: Are foreign keys not supposed to be a number?
      keyresultfk: string, // RS: Are foreign keys not supposed to be a number?
      strengths: string,
      developmentarea: string,
      datecreated: string,
      timecreated: string,
      createdby: string,
      actiontaken: string,
      takenby: string,
      dateofactiontaken: string,
      timeofactiontaken: string
   },
   developmentAreaList: [ // why is there a list object in here - certainly this call should just return a single item or a list?
      {
         id: number,
         appraisalfk: string, // RS: Are foreign keys not supposed to be a number?
         keyresultfk: string, // RS: Are foreign keys not supposed to be a number?
         strengths: string,
         developmentarea: string,
         datecreated: string,
         timecreated: string,
         createdby: string,
         actiontaken: string,
         takenby: string,
         dateofactiontaken: string,
         timeofactiontaken: string
      }
   ]
}

// TODO: DUPLICATE FROM GOAL BATCH
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

export interface IBaseReviewModel {
   userId: number;
   upn: string;
   order: number;
   outcome: number;
}

export interface IAppraisalReviewModel extends IBaseReviewModel {
   id: number;
   comments: string,
   approved: boolean;
}

export interface IAppraisalGoalReviewModel extends IBaseReviewModel {
   kraTitle: string, 
   kraId: number, 
   goalId: number,
   completed: boolean,
}

// TODO: Trying to reduce the amount of info on a appraisal - But this is actually a goalBatch approval...
export interface IAppraisalX {
   id: number;
   title: string;
   status: string;
   userId: number;
   currentLevel: number;
   appraisalPeriodId: number;
   createdTimestamp: number;
   reviews: IAppraisalReviewModel[];
   goals: IAppraisalGoalModel[];
}
export interface IReviewHistoryItem {
   id: number;
   status: string;
   userId: number;
   level: number;
   comments: string;
   createdTimestamp: number;
}

export interface IReviewHistoryItemAPIModel {
   id: number;
   empfk: number;
   role: string;
   status: string;
   datecreated: string;
   timecreated: string;
   comment: string;
   actiontaken?: string;
}

export interface IReviewHistoryAPIModel {
   appraisalHistory: IReviewHistoryItemAPIModel[];
   status: string;
   message: string;
}

const ttt = {
   "id": 336595,
   "empfk": 105,
   "role": "Initiator",
   "status": "Completed",
   "datecreated": "2022-06-17",
   "timecreated": "11:29:14 AM",
   "comment": "",
   "actiontaken": "",
}

export interface IAppraisalGoalModel {
   userId: number;
   id: number;
   kraId: number;
   kraTitle: string;
   timing: string;
   weight: number;
   priority: number;
   createdTimestamp: number;
   description: string;
   measureOfSuccess: string;
   achievementCriteria: string;
   batchId: number;
   reviews: IAppraisalGoalReviewModel[];
}


// Note this is the same as the IGoalModel and might be removed
export interface IAppraisalModel {
   userId: number;
   id: number;
   kraId: number;
   kraTitle?: string;
   timing: string;
   weight: number;
   priority: number;
   createdTimestamp: number;
   description: string;
   measureOfSuccess: string;
   achievementCriteria: string;
   batchId: number;
   actualResultSelf: number;
   actualResultManager: number;
}

export const newAppraisalX: IAppraisalX = {
   id: 0,
   title: ``,
   status: ``,
   userId: 0,
   currentLevel: 0,
   appraisalPeriodId: 0,
   createdTimestamp: 0,
   reviews: [],
   goals: [],
}

export const newAppraisal: IAppraisalModel = {
   userId: 0,
   id: 0,
   kraId: 0,
   timing: "",
   weight: 0,
   priority: 0,
   createdTimestamp: 0,
   description: "",
   measureOfSuccess: "",
   achievementCriteria: "",
   batchId: 0,
   actualResultSelf: 0,
   actualResultManager: 0
}

export interface IAppraisalListItemModel {
   name: string;
   approvalStatus: string;
   selfReviewAverage: number;
   managerReviewAverage: number;
   created: string;
   appraisalTitleId: number;
   appraisalPeriodId: number;
}

export class ResponseModel {
   error: any;
   data: any;
   meta: any;
}

export class AppraisalResponseModel {
   status: any;
   message: any;
   appraisaltitle: any;
}

export interface IAppraisalSearchModel {
   goalId: number;
   userId: number;
}

export interface IAppraisalListSearchModel {
   appraisalPeriodId?: number;
   batchId?: number;
   userId: number;
}

export interface ISelfAppraisalModel {
   goalId: number,
   employeeId: number,
   keyResultAreaId: number,
   careerAspiration: string,
   suggestedDevelopmentActions: string
}

export interface ISelfAppraisalActualResultModel {
   goalId: number,
   employeeId: number,
   keyResultAreaId: number,
   actualResult: number
}

export interface IManagerReviewAppraisalSaveModel {
   goalId: number;
   managerId: number;
   actualResult: string;
}

export interface IManagerCareerAspirationReviewAppraisalModel {
   goalId: number,
   managerId: number,
   careerOutLook: string
}

export interface IManagerGeneralCommentModel {
   goaldId: number,
   generalComment: string
}