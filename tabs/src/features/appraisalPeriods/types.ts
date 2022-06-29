
export const months: string[] = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export interface IAppraisalPeriodAPIModel {
   data: {
      id: number;
      cnamefk: number;
      year: string;
      month: string;
      status: string;
      createdbyfk: number;
   };
   status: string;
   message: string;
}

export interface IAppraisalPeriodListAPIModel {
   data: {
      id: number;
      cnamefk: number;
      year: string;
      month: string;
      status: string;
      createdbyfk: number;
   }[];
   status: string;
   message: string;
}

export interface IAppraisalPeriodModel {
   id: number,
   title: string,
   status: string,
   startTimestamp: number,
   endTimestamp: number,
   startMonthIndex: number,
   endMonthIndex: number,
   year: number,
   reminderFrequency?: string, //'daily', 'weekly', 'monthly'
   active: boolean,
}

export const newAppraisalPeriod: IAppraisalPeriodModel = {
   id: 0,
   title: '',
   status: '', // none, current
   startTimestamp: new Date(2022, 1, 1).getTime(),
   endTimestamp: new Date(2022, 6, 1).getTime(),
   startMonthIndex: 0,
   endMonthIndex: 0,
   year: 2022,
   reminderFrequency: 'daily',
   active: false,
}