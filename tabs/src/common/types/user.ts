import { IBaseModel } from ".";

export interface IBasicUserModel extends IBaseModel {
   upn: string,
   image?: string,
}
export interface IUserModel extends IBasicUserModel {
   firstName: string;
   lastName: string;
   jobTitle: string;
   department: IBaseModel;
   managers: IUserModel[];
   status: string;
   availability?: string,
   activity?: string,
}

export const newUser: IUserModel = {
   title: '',
   status: 'active',
   id: '',
   upn: '',
   firstName: '',
   lastName: '',
   jobTitle: '',
   department: {id: '', title: '', createdTimestamp:new Date().getTime(), active: true},
   managers: [],
   active: true,
   createdTimestamp: new Date().getTime(),
}