import { IBaseModel } from ".";

export interface ICompetencyModel extends IBaseModel {
   description: string;
   kraTitle: string;
   kraId: string;
   coreValueTitle: string;
   coreValueId: string;
   weight: number;
   status: string;
}

export const newCompetency: ICompetencyModel = {
   description: "",
   kraTitle: "",
   kraId: "",
   coreValueTitle: "",
   coreValueId: "",
   weight: 0,
   id: "",
   title: "",
   createdTimestamp: 0,
   status: "",
   active: false
}