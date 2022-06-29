export interface IEmployeeAPIModel {
   employee: {
      id: number;
      email: string;
      staffId: string;
      cnamefk: number;
      firstName: string;
      middleName: string;
      lastName: string;
      jobTitle: string;
      department: string;
      workGrade: string;
      status: string;
      employeeType: string;
      line1fk: number;
      line1: string;
      line2fk: string;
      line2: string;
      jobtitlefk: number;
      deptfk: number;
      workgradefk: number;
   };
   status: string;
   message: string;
}

export interface IUserModel {
   id: number,
   upn: string,
   title: string,
   jobTitle: string;
   department: string;
   image?: string,
}

export interface IEmployeeModel extends IUserModel {
   jobTitleId: number,
   departmentId: number,
   companyId: number,
   managers: { order: number, id: number, upn: string, title: string }[]
}

export const newEmployee: IEmployeeModel = {
   id: 0,
   upn: "",
   title: "",
   jobTitle: "",
   department: "",
   companyId: 9,
   jobTitleId: 1,
   departmentId: 1,
   managers: [{
      order: 0,
      id: 1,
      upn: "First UPN",
      title: "First Line Manager"
   }, {
      order: 1,
      id: 2,
      upn: "Second UPN",
      title: "Second Line Manager"
   }],
}