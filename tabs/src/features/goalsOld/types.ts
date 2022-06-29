import { IBaseModel } from '../../common/types';
import { IAppraisalPeriodModel } from '../appraisalPeriods/types';

export interface IGoalModel extends IBaseModel {
   userDisplayName: string;
   userUPN: string;
   kraTitle: string;
   kraId: string;
   timing: string;
   weight: number;
   priority: number;
   status: string;
   description: string;
   measureOfSuccess: string;
   achievementCriteria: string;
   appraisalPeriod?: IAppraisalPeriodModel;
   appraisalPeriodId: string;
   batchId: string;
   batchStatus: string;
   batchCurrentLevel: number;
   batchTotalLevels: number;
}

export const newGoal: IGoalModel = {
   userDisplayName: '',
   userUPN: '',
   id: '',
   kraTitle: '',
   kraId: '1',
   timing: 'daily',
   weight: 0,
   priority: 1,
   status: 'created',
   title: '',
   active: true,
   createdTimestamp: new Date().getTime(),
   appraisalPeriodId: '5',
   description: '',
   measureOfSuccess: '',
   achievementCriteria: '',
   batchId: '-1',
   batchStatus: 'submitted',
   batchCurrentLevel: 0,
   batchTotalLevels: -1,
}