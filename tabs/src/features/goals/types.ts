export interface IGoalAPIModel {
   data: { // bug - object here, other places an array
      id: number;
      keyresultarea: string; // bug - string pointing to integer id, fk also missing
      keyresultareafk: number;
      decription: string; // bug - spelling
      measureofsuccess: string;
      achievementcriteria: string;
      timing: string;
      weight: number;
      priority: number;
      actualresultSelf: string;// bug - camelCase?
      actualresultManager: string;//
      datecreated: string;//
      timecreated: string;//
      createdby: number;
      appraisalTitleId: number;
      empfk: number;
      // bug - where is appraisal period id for filtering?
   };
   status: string;
   message: string;
}

export interface IGoalListAPIModel {
   data: {
      id: number;
      keyresultarea: string;
      keyresultareafk: number;
      decription: string;
      measureofsuccess: string;
      achievementcriteria: string;
      timing: string;
      weight: number;
      priority: number;
      actualresultSelf: string;//
      actualresultManager: string;//
      datecreated: string;//
      timecreated: string;//
      createdby: number;//
      appraisalTitleId: number;
      empfk: number;
   }[];
   status: string;
   message: string;
}

export interface IGoalModel {
   userId: number;
   userDisplayName?: string; // bug, we need this or the upn
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
}

export const newGoal: IGoalModel = {
   userId: 0,
   id: 0,
   kraId: 0,
   kraTitle: "",
   timing: "",
   weight: 0,
   priority: 0,
   createdTimestamp: 0,
   description: "",
   measureOfSuccess: "",
   achievementCriteria: "",
   batchId: 0
}

export const oldGoal = {
   userId: 0, // empfk
   id: 0, // id
   kraId: '1', // keyresultarea
   timing: 'daily', // timing
   weight: 0, // weight
   priority: 1, // priority
   createdTimestamp: new Date().getTime(), // datecreated, timecreated
   description: '', // decription
   measureOfSuccess: '', // measureofsuccess
   achievementCriteria: '', // achievementcriteria
   batchId: 1, //appraisalTitleId
   // batchStatus: 'pending',// NaN
   // appraisalPeriodId: '5',// NaN
   // batchCurrentLevel: 0,// NaN
   // batchTotalLevels: -1,// NaN
   // userDisplayName: '', // NaN
   // kraTitle: '', // NaN
   // status: 'created',// NaN
   // title: '',// NaN
   // active: true,// NaN
}


const tmp = {
   "id": 1275,
   "keyresultarea": "6",
   "actualresultSelf": "15",
   "actualresultManager": "17",
   "decription": "Effective handling of business meeting and travel logistic of the MD/CEO",
   "measureofsuccess": "Adequate preparation of the CEO for meetings and prompt adherence to meeting time",
   "timing": "Continuous",
   "weight": 20,
   "achievementcriteria": "Timeliness for meetings and adequacy travel logistics",
   "datecreated": "2018-11-30",
   "timecreated": "06:59:33 PM",
   "createdby": 132,
   "priority": 5,
   "appraisalTitleId": 30,
   "empfk": 132
 }