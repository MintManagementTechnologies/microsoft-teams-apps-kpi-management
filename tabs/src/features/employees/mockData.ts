import { IEmployeeModel } from './types';

const mockData = [{
   id: 1424,
   upn: "abrie@ajacsrsa1.onmicrosoft.com",
   title: "Abrie van Wyk",
   jobTitle: "A big title",
   department: "The other one",
   jobTitleId: 1,
   departmentId: 1,
   companyId: 9,
   managers: [{
      order: 0,
      id: 1,
      upn: "jessica@ajacsrsa1.onmicrosoft.com",
      title: "First Jessica"
   }, {
      order: 1,
      id: 2,
      upn: "amanda@ajacsrsa1.onmicrosoft.com",
      title: "Second Amanda"
   }],
},{
   id: 96,
   upn: "jessica@ajacsrsa1.onmicrosoft.com",
   title: "Jessica Alberts",
   jobTitle: "Graphic Designer",
   department: "Sales",
   companyId: 9,
   jobTitleId: 3,
   departmentId: 1,
   managers: [],
},{
   id: 2,
   upn: "amanda@ajacsrsa1.onmicrosoft.com",
   title: "Amanda Ellis",
   jobTitle: "Team Lead",
   department: "Modern Minds",
   companyId: 9,
   jobTitleId: 2,
   departmentId: 1,
   managers: [],
}
] as IEmployeeModel[]
export default mockData;
export const meMockData = mockData.find(x => x.id === 1424) as IEmployeeModel;
export const myManagersMockData = mockData.filter(x => x.id !== 1424);