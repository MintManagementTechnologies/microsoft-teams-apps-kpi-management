export interface ICompetencyListAPIModel {
   kracompetence: {
       id: number;
       keyarearesultfk: number;
       workgradefk: number;
       competence: string;
       description: string;
       weight: number;
       createdby: number;
       datecreated: string;
       timecreated: string;
       keyresultarea: string;
   }[];
   status: string;
   message: string;
}

export interface ICompetencyAPIModel {
   keyarearesultfk: number;
   workgradefk: number;
   competence: string;
   description: string;
   weight: number;
   createdby: number;
}

export interface ICompetencyModel {
   kraId: number; //keyarearesultfk
   kraTitle: string; //keyresultarea
   workgradeId: number;
   title: string;
   description: string;
   weight: number;
   id: number;
}

export const newCompetency: ICompetencyModel = {
   kraId: 0,
   kraTitle: "",
   workgradeId: 0,
   title: "",
   description: "",
   weight: 0,
   id: 0
}