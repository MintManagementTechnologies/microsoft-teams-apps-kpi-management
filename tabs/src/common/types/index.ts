export type filterTypeOption = string | string[] | number | number[] | boolean | IDateRange;

export interface IDateRange {
   start: number;
   end: number;
}

export interface IBaseModel {
   id: string;
   title: string;
   createdTimestamp: number;
   active: boolean;
}