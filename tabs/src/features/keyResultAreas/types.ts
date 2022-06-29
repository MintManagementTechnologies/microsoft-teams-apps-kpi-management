export interface IKeyResultAreaAPIModel {
   keyreultareas: {
      id: number;
      keyresultarea: string;
      status?: string;
      datecreated?: string;
      timecreated?: string;
      createdby?: number;
   };
   status: string;
   message: string;
}

export interface IKeyResultAreaListAPIModel {
   keyreultareas: {
      id: number;
      keyresultarea: string;
      status?: string;
      datecreated?: string;
      timecreated?: string;
      createdby?: number;
   }[];
   status: string;
   message: string;
}

export interface IKeyResultAreaModel {
   id: number;
   title: string;
   // status?: string;
   createdby: number;
}

export const newKeyResultArea: IKeyResultAreaModel = {
   id: 0,
   title: '',
   createdby: 0
}