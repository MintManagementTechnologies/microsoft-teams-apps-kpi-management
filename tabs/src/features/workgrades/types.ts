export interface IWorkgradeListAPIModel {
   workgrade: {
      id: number;
      cnamefk: number;
      workgrade: string;
  }[];
   status: string;
   message: string;
}

export interface IWorkgradeModel {
   id: number;
   title: string;
}