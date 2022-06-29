import mockData from '../goals/mockData';
import { IAppraisalListItemModel, IAppraisalReviewModel, IAppraisalX } from './types';

export default [{
   name: "January - June 2021",
   approvalStatus: "Approved",
   selfReviewAverage: 85,
   managerReviewAverage: 75,
   created: new Date().toLocaleDateString(),
   appraisalPeriodId: 1,
   appraisalTitleId: 2
},{
   name: "July - December 2021",
   approvalStatus: "Pending",
   selfReviewAverage: 90,
   managerReviewAverage: 83,
   created: new Date().toLocaleDateString(),
   appraisalPeriodId: 3,
   appraisalTitleId: 4
}] as IAppraisalListItemModel[]

const emp1_self_review: IAppraisalReviewModel = {
   id: 926,
   userId: 1424,
   upn: 'abrie@ajacsrsa1.onmicrosoft.com',
   order: 0,
   outcome: 69.69,
   comments: '',
   approved: false
}

const emp1_manager1_review: IAppraisalReviewModel = {
   id: 926,
   userId: 96,
   upn: 'jessica@ajacsrsa1.onmicrosoft.com',
   order: 1,
   outcome: 42.00,
   comments: '',
   approved: false
}

const emp1_manager2_review: IAppraisalReviewModel = {
   id: 926,
   userId: 111,
   upn: 'amanda@ajacsrsa1.onmicrosoft.com',
   order: 2,
   outcome: 0,
   comments: '',
   approved: false
}

export const emp1_appraisals = [{
   id: 926,
   title: `January - December 2022`,
   status: `pending`,
   userId: 1424,
   currentLevel: 0,
   appraisalPeriodId: 103,
   createdTimestamp: new Date().getTime(),
   reviews: [emp1_self_review, emp1_manager1_review, emp1_manager2_review],
   goals: []
},
{
   id: 1109,
   title: `January - December 2021`,
   status: `approved`,
   userId: 1424,
   currentLevel: 0,
   appraisalPeriodId: 102,
   createdTimestamp: new Date().getTime(),
   reviews: [emp1_self_review, emp1_manager1_review],
   goals: []
}] as IAppraisalX[];

export const myAppraisalGoalsMockData = mockData.filter(x => x.userId === 1424).map((x,i) => ({
   ...x,
   reviews: [{
      userId: 1424,
      upn: 'abrie@ajacsrsa1.onmicrosoft.com',
      order: 0,
      outcome: (i % 2 === 0) ? 0 : Math.floor(Math.random() * (x.weight+1)),
      kraTitle: x.kraTitle,
      kraId: x.kraId,
      goalId: x.id,
      completed: (i % 2 !== 0),
   },{
      userId: 96,
      upn: 'jessica@ajacsrsa1.onmicrosoft.com',
      order: 1,
      outcome: 0,
      kraTitle: x.kraTitle,
      kraId: x.kraId,
      goalId: x.id,
      completed: false,
   },{
      userId: 111,
      upn: 'amanda@ajacsrsa1.onmicrosoft.com',
      order: 2,
      outcome: 0,
      kraTitle: x.kraTitle,
      kraId: x.kraId,
      goalId: x.id,
      completed: false,
   }]
}));