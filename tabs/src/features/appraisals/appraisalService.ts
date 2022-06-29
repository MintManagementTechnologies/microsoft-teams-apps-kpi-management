import { getStatusAndApprovalLevel } from '../../common/utils/configVariables';
import { baseApi, IBaseApiResponse } from '../../services';
import { IAppraisalPeriodModel } from '../appraisalPeriods/types';
import { IGoalBatchModel } from '../goalBatches/types';
// import mockData, { emp1_appraisals, myAppraisalGoalsMockData } from './mockData';
import {
    AppraisalResponseModel, IAppraisalAPIModel, IAppraisalGoalItemAPIModel, IAppraisalGoalModel,
    IAppraisalGoalReviewModel, IAppraisalListItemModel, IAppraisalListSearchModel, IAppraisalModel,
    IAppraisalReviewModel, IAppraisalSearchModel, IAppraisalX, IGoalBatchListAPIModel,
    IManagerCareerAspirationReviewAppraisalModel, IManagerGeneralCommentModel,
    IManagerReviewAppraisalSaveModel, IReviewHistoryAPIModel, IReviewHistoryItem,
    IReviewHistoryItemAPIModel, ISelfAppraisalActualResultModel, ISelfAppraisalModel, ResponseModel
} from './types';

export const appraisalService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getAppraisalGoals: build.query<IAppraisalGoalModel[], IAppraisalListSearchModel>({
         // query: (appraisalListSearch) => `/Appraisal/GetGoalListForAppriasal/1/94`,
         // async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
         //    return { data: myAppraisalGoalsMockData };
         // },
         query: (appraisalListSearch) => `/Appraisal/GetGoalListForAppriasal/${appraisalListSearch.userId}/${appraisalListSearch.batchId}`,
         transformResponse: (rawResult: IAppraisalAPIModel, meta) => {
            // if(rawResult.appraisaltitle.length === 0){
            // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            // console.error('appraisalService -> getAppraisalGoals');
            // console.log('using mockData...');
            // return myAppraisalGoalsMockData;
            // }
            const apiResult = rawResult.goalList.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

               const employee_review: IAppraisalGoalReviewModel = {
                  userId: x.empfk,
                  upn: '',
                  order: 0,
                  outcome: parseFloat(x.actualresultSelf),
                  kraTitle: x.keyresultarea,
                  kraId: x.keyresultareafk,
                  goalId: x.id,
                  completed: x.actualresultSelf !== null
               }

               const manager1_review: IAppraisalGoalReviewModel = {
                  userId: 0,
                  upn: '',
                  order: 1,
                  outcome: parseFloat(x.actualresultManager),
                  kraTitle: x.keyresultarea,
                  kraId: x.keyresultareafk,
                  goalId: x.id,
                  completed: x.actualresultManager !== null
               }

               const transformedResult = {
                  userId: x.empfk,
                  id: x.id,
                  kraTitle: x.keyresultarea,
                  kraId: x.keyresultareafk,
                  timing: x.timing,
                  weight: x.weight,
                  priority: x.priority,
                  createdTimestamp: tmpDateTime.getTime(),
                  description: x.decription,
                  measureOfSuccess: x.measureofsuccess,
                  achievementCriteria: x.achievementcriteria,
                  batchId: x.appraisalTitleId,
                  reviews: [employee_review, manager1_review]
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      getAppraisalsAsEmployee: build.query<IAppraisalX[], IAppraisalListSearchModel>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            let result: IAppraisalX[] = [];
            // if(!rawResult.employee){
            // console.error(`NO ITEMS FROM API`);
            // console.error('appraisalService -> getAppraisalsAsReviewer');
            // console.log('using mockData...');
            // return { data: emp1_appraisals };
            // }

            // query: (arg) => `/AppraisalTitle/ForPeriod/${arg.appraisalPeriodId}/${arg.userId}`,
            try {
               // first we get the appraisal periods
               const goalBatchesRequiringApprovalResponse = await baseQuery({
                  url: `/AppraisalTitle/ForPeriod/${_arg.appraisalPeriodId}/${_arg.userId}`,
                  method: 'GET'
               });
               const goalBatchesRequiringApproval = goalBatchesRequiringApprovalResponse.data as IGoalBatchListAPIModel;
               const appraisalsRequiringApproval = goalBatchesRequiringApproval.appraisaltitle.filter(x => x.performanceManagementStage === 'Appraisal' || (x.performanceManagementStage === 'Goal Setting' && x.status === 'Approved'))
               for await (const appraisal of appraisalsRequiringApproval) {
                  // Now get the appraisal items for each appraisal title id
                  const appraisalGoalsQuery = await baseQuery({
                     url: `/Appraisal/GetGoalListForAppriasal/${appraisal.empfk}/${appraisal.id}`,
                     method: 'GET'
                  });

                  if (!appraisalGoalsQuery.error) {
                     let appraisalGoalsResponse = appraisalGoalsQuery.data as IAppraisalAPIModel;
                     let appraisalGoals: IAppraisalGoalItemAPIModel[] = appraisalGoalsResponse.goalList;

                     let employee_outcomeTotal = 0;
                     let manager1_outcomeTotal = 0;
                     appraisalGoals.forEach(x => {
                        employee_outcomeTotal += (x.actualresultSelf ? parseFloat(x.actualresultSelf) : 0);
                        manager1_outcomeTotal += (x.actualresultManager ? parseFloat(x.actualresultManager) : 0);
                        // employee_outcomeTotal += (x.actualresultSelf ? (parseFloat(x.actualresultSelf) / 100) * x.weight : 0);
                        // manager1_outcomeTotal += (x.actualresultManager ? (parseFloat(x.actualresultManager) / 100) * x.weight : 0);
                     });

                     const employee_review: IAppraisalReviewModel = {
                        id: appraisal.id,
                        userId: appraisal.empfk,
                        upn: '',
                        order: 0,
                        outcome: employee_outcomeTotal,
                        comments: '',
                        approved: false,
                     }

                     const manager1_review: IAppraisalReviewModel = {
                        id: appraisal.id,
                        userId: 0,
                        upn: '',
                        order: 1,
                        outcome: manager1_outcomeTotal,
                        comments: '',
                        approved: false,
                     }
                     const tmpStatus = (appraisal.performanceManagementStage === 'Goal Setting' && appraisal.status === 'Approved') ? 'pending' : appraisal.status;
                     const { currentLevel, currentStatus } = getStatusAndApprovalLevel(tmpStatus);
                     const tmpDateValue = appraisal.datecreated;
                     const tmpTimeValue = appraisal.timecreated;
                     const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

                     // TODO: Trying to reduce the amount of info on a appraisal - But this is actually a goalBatch approval...
                     const tmpResult: IAppraisalX = {
                        id: appraisal.id,
                        title: appraisal.title,
                        status: currentStatus,
                        userId: appraisal.empfk,
                        currentLevel: currentLevel,
                        appraisalPeriodId: appraisal.appraisalPeriodfk,
                        createdTimestamp: tmpDateTime.getTime(),
                        reviews: [employee_review, manager1_review],
                        goals: []
                     }

                     // Now we can build up a custom object for display purposes
                     result.push(tmpResult)
                  }
               }
               return { data: result };
            } catch (error: any) {
               console.error(`catch error`);
               console.log(error);
               debugger;
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getAppraisalsAsReviewer: build.query<IAppraisalX[], IAppraisalListSearchModel>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            let result: IAppraisalX[] = [];
            // if(!rawResult.employee){
            // console.error(`NO ITEMS FROM API`);
            // console.error('appraisalService -> getAppraisalsAsReviewer');
            // console.log('using mockData...');
            // return { data: emp1_appraisals };
            // }

            try {
               // first we get the appraisal periods
               const goalBatchesRequiringApprovalResponse = await baseQuery({
                  url: `/AppraisalTitle/PendingApprovals/${_arg.appraisalPeriodId}/${_arg.userId}`,
                  method: 'GET'
               });
               const goalBatchesRequiringApproval = goalBatchesRequiringApprovalResponse.data as IGoalBatchListAPIModel;
               const appraisalsRequiringApproval = goalBatchesRequiringApproval.appraisaltitle.filter(x => x.performanceManagementStage === 'Appraisal')
               for await (const appraisal of appraisalsRequiringApproval) {
                  // Now get the appraisal items for each appraisal title id
                  const appraisalGoalsQuery = await baseQuery({
                     url: `/Appraisal/GetGoalListForAppriasal/${appraisal.empfk}/${appraisal.id}`,
                     method: 'GET'
                  });

                  if (!appraisalGoalsQuery.error) {
                     let appraisalGoalsResponse = appraisalGoalsQuery.data as IAppraisalAPIModel;
                     let appraisalGoals: IAppraisalGoalItemAPIModel[] = appraisalGoalsResponse.goalList;

                     let employee_outcomeTotal = 0;
                     let manager1_outcomeTotal = 0;
                     appraisalGoals.forEach(x => {
                        employee_outcomeTotal += (x.actualresultSelf ? parseFloat(x.actualresultSelf) : 0);
                        manager1_outcomeTotal += (x.actualresultManager ? parseFloat(x.actualresultManager) : 0);
                        // employee_outcomeTotal += (x.actualresultSelf ? (parseFloat(x.actualresultSelf) / 100) * x.weight : 0);
                        // manager1_outcomeTotal += (x.actualresultManager ? (parseFloat(x.actualresultManager) / 100) * x.weight : 0);
                     });

                     const employee_review: IAppraisalReviewModel = {
                        id: appraisal.id,
                        userId: appraisal.empfk,
                        upn: '',
                        order: 0,
                        outcome: employee_outcomeTotal,
                        comments: '',
                        approved: false,
                     }

                     const manager1_review: IAppraisalReviewModel = {
                        id: appraisal.id,
                        userId: 0,
                        upn: '',
                        order: 1,
                        outcome: manager1_outcomeTotal,
                        comments: '',
                        approved: false,
                     }

                     const { currentLevel, currentStatus } = getStatusAndApprovalLevel(appraisal.status);
                     const tmpDateValue = appraisal.datecreated;
                     const tmpTimeValue = appraisal.timecreated;
                     const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

                     // TODO: Trying to reduce the amount of info on a appraisal - But this is actually a goalBatch approval...
                     const tmpResult: IAppraisalX = {
                        id: appraisal.id,
                        title: appraisal.title,
                        status: currentStatus,
                        userId: appraisal.empfk,
                        currentLevel: currentLevel,
                        appraisalPeriodId: appraisal.appraisalPeriodfk,
                        createdTimestamp: tmpDateTime.getTime(),
                        reviews: [employee_review, manager1_review],
                        goals: []
                     }

                     // Now we can build up a custom object for display purposes
                     result.push(tmpResult)
                  }
               }
               return { data: result };
            } catch (error: any) {
               console.error(`catch error`);
               console.log(error);
               debugger;
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getAppraisalReviewHistory: build.query<IReviewHistoryItem[], number>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            let result: IReviewHistoryItem[] = [];

            try {
               const reviewHistoryResponse = await baseQuery({
                  url: `/Approvals/AppraisalApprovalHistory/${_arg}`,
                  method: 'GET'
               });
               const reviewHistory = reviewHistoryResponse.data as IReviewHistoryAPIModel;
               const reviewHistoryItems = reviewHistory.appraisalHistory.filter(x => x.role !== "Staff Comment");
               const createdBy_reviewHistoryItem = reviewHistoryItems.find(x => x.role === "Initiator");
               const manager1_reviewHistoryItem = reviewHistoryItems.find(x => x.role === "Line1");
               const manager2_reviewHistoryItem = reviewHistoryItems.find(x => x.role === "Line2");
               const manager3_reviewHistoryItem = reviewHistoryItems.find(x => x.role === "HR");

               if (createdBy_reviewHistoryItem) {
                  const tmpDateValue = createdBy_reviewHistoryItem.datecreated;
                  const tmpTimeValue = createdBy_reviewHistoryItem.timecreated;
                  const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
                  let tmpStatus = 'notStarted';
                  // let tmpOutcome = '';
                  switch (createdBy_reviewHistoryItem.status) {
                     case "Completed":
                        tmpStatus = 'completed';
                        // tmpOutcome = 'submitted';
                        break;
                     case "Pending":
                        tmpStatus = 'pending';
                        // tmpOutcome = '';
                        break;
                     case "Approved":
                        tmpStatus = 'approved';
                        // tmpOutcome = 'approved';
                        break;
                     case "Declined":
                     case "Rejected":
                        tmpStatus = 'rejected';
                        // tmpOutcome = 'rejected';
                        break;
                     default:
                        break;
                  }
                  result.push({
                     id: createdBy_reviewHistoryItem.id,
                     status: tmpStatus,
                     userId: createdBy_reviewHistoryItem.empfk,
                     level: 0,
                     comments: createdBy_reviewHistoryItem.comment,
                     createdTimestamp: tmpDateTime.getTime(),
                  })
               } else {
                  result.push({
                     id: 0,
                     status: '',
                     userId: 0,
                     level: 0,
                     comments: '',
                     createdTimestamp: new Date().getTime(),
                  })
               }

               if (manager1_reviewHistoryItem) {
                  const tmpDateValue = manager1_reviewHistoryItem.datecreated;
                  const tmpTimeValue = manager1_reviewHistoryItem.timecreated;
                  const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
                  let tmpStatus = 'notStarted';
                  // let tmpOutcome = '';
                  switch (manager1_reviewHistoryItem.status) {
                     case "Completed":
                        tmpStatus = 'completed';
                        // tmpOutcome = 'submitted';
                        break;
                     case "Pending":
                        tmpStatus = 'pending';
                        // tmpOutcome = '';
                        break;
                     case "Approved":
                        tmpStatus = 'approved';
                        // tmpOutcome = 'approved';
                        break;
                     case "Declined":
                     case "Rejected":
                        tmpStatus = 'rejected';
                        // tmpOutcome = 'rejected';
                        break;
                     default:
                        break;
                  }
                  result.push({
                     id: manager1_reviewHistoryItem.id,
                     status: tmpStatus,
                     userId: manager1_reviewHistoryItem.empfk,
                     level: 1,
                     comments: manager1_reviewHistoryItem.comment,
                     createdTimestamp: tmpDateTime.getTime(),
                  })
               } else {
                  result.push({
                     id: 0,
                     status: '',
                     userId: 0,
                     level: 1,
                     comments: '',
                     createdTimestamp: new Date().getTime(),
                  })
               }

               if (manager2_reviewHistoryItem) {
                  const tmpDateValue = manager2_reviewHistoryItem.datecreated;
                  const tmpTimeValue = manager2_reviewHistoryItem.timecreated;
                  const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
                  let tmpStatus = 'notStarted';
                  // let tmpOutcome = '';
                  switch (manager2_reviewHistoryItem.status) {
                     case "Completed":
                        tmpStatus = 'completed';
                        // tmpOutcome = 'submitted';
                        break;
                     case "Pending":
                        tmpStatus = 'pending';
                        // tmpOutcome = '';
                        break;
                     case "Approved":
                        tmpStatus = 'approved';
                        // tmpOutcome = 'approved';
                        break;
                     case "Declined":
                     case "Rejected":
                        tmpStatus = 'rejected';
                        // tmpOutcome = 'rejected';
                        break;
                     default:
                        break;
                  }
                  result.push({
                     id: manager2_reviewHistoryItem.id,
                     status: tmpStatus,
                     userId: manager2_reviewHistoryItem.empfk,
                     level: 2,
                     comments: manager2_reviewHistoryItem.comment,
                     createdTimestamp: tmpDateTime.getTime(),
                  })
               } else {
                  result.push({
                     id: 0,
                     status: '',
                     userId: 0,
                     level: 2,
                     comments: '',
                     createdTimestamp: new Date().getTime(),
                  })
               }

               if (manager3_reviewHistoryItem) {
                  const tmpDateValue = manager3_reviewHistoryItem.datecreated;
                  const tmpTimeValue = manager3_reviewHistoryItem.timecreated;
                  const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
                  let tmpStatus = 'notStarted';
                  // let tmpOutcome = '';
                  switch (manager3_reviewHistoryItem.status) {
                     case "Completed":
                        tmpStatus = 'completed';
                        // tmpOutcome = 'submitted';
                        break;
                     case "Pending":
                        tmpStatus = 'pending';
                        // tmpOutcome = '';
                        break;
                     case "Approved":
                        tmpStatus = 'approved';
                        // tmpOutcome = 'approved';
                        break;
                     case "Declined":
                     case "Rejected":
                        tmpStatus = 'rejected';
                        // tmpOutcome = 'rejected';
                        break;
                     default:
                        break;
                  }
                  result.push({
                     id: manager3_reviewHistoryItem.id,
                     status: tmpStatus,
                     userId: manager3_reviewHistoryItem.empfk,
                     level: 3,
                     comments: manager3_reviewHistoryItem.comment,
                     createdTimestamp: tmpDateTime.getTime(),
                  })
               } else {
                  result.push({
                     id: 0,
                     status: '',
                     userId: 0,
                     level: 3,
                     comments: '',
                     createdTimestamp: new Date().getTime(),
                  })
               }

               return { data: result };
            } catch (error: any) {
               console.error(`catch error`);
               console.log(error);
               debugger;
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      submitAppraisalForApproval: build.mutation<IBaseApiResponse, Partial<IAppraisalReviewModel>>({
         query(tmp) {
            const { id, userId } = tmp;
            return {
               url: `/Approvals/EmployeeAppraisalSubmission/${id}?takenby=${userId}`,
               method: 'PUT'
            };
         }
      }),
      saveAppraisalGoalReview: build.mutation<IBaseApiResponse, IAppraisalGoalReviewModel>({
         query(item) {
            // const goal_AppraisalTitleHistory = {
            //    id: 928,
            //    empfk: 111,
            //    appraisalPeriodfk: 103,
            //    title: "Goal setting",
            //    status: "Line1",
            //    datecreated: "2018-02-23",
            //    timecreated: "06:50:05 PM",
            //    performanceManagementStage: "Goal Setting"
            // }
            // const appraisal_AppraisalTitleHistory = {
            //    id: 1122,
            //    empfk: 138,
            //    appraisalPeriodfk: 103,
            //    title: "ECREDITIN",
            //    status: "Saved",
            //    datecreated: "2018-06-07",
            //    timecreated: "06:46:46 PM",
            //    performanceManagementStage: "Appraisal"
            // }

            // const item = {
            //    order: 0,
            //    goalId: 6668,
            //    userId: 138,
            //    kraId: 6,
            //    outcome: 24,
            // }
            if (item.order === 0) {
               const body = {
                  goalId: item.goalId,
                  employeeId: item.userId,
                  keyResultAreaId: item.kraId,
                  actualResult: item.outcome
               }
               return {
                  url: `/Appraisal/GoalSelfAppraisalActualResult`,
                  method: 'PUT',
                  body: body
               };
            } else {
               return {
                  url: `/Appraisal/SaveManagerReviewAppraisal/${item.goalId}/${item.userId}?actualResult=${item.outcome}`,
                  method: 'PUT'
               };
            }
         }
      }),
      saveAppraisalReview: build.mutation<IBaseApiResponse, IAppraisalReviewModel>({
         query(item) {
            // const item = {
            //    id: 6668,
            //    order: 0,
            //    userId: 138,
            //    outcome: 54,
            //    approved: true,
            //    comments: `ABRIE TEST Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.`
            // }
            if (item.order === 0) {
               return {
                  url: `/Approvals/EmployeeAppraisalSubmission/${item.id}?takenby=${item.userId}`,
                  method: 'PUT'
               };
            } else {
               const body = {
                  approvedBy: item.userId,
                  isApproved: item.approved,
                  comment: item.comments
               }
               return {
                  url: `/Approvals/AppraisalApproval/${item.id}`,
                  method: 'PUT',
                  body
               };
            }
         }
      }),


      getAppraisalsByEmployeeId: build.query<IAppraisalListItemModel[], number>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {

            let userId = _arg;
            let result: { success: boolean, data: IAppraisalListItemModel[] } = { success: false, data: [] };

            try {
               // first we get the appraisal periods
               const appraisalPeriodQuery = await baseQuery({
                  url: `/AppraisalPeriod`,
                  method: 'GET'
               });

               // Next we get all appraisal titles for each period by userId
               let periodsResponse = appraisalPeriodQuery.data as ResponseModel;

               for await (const periodItem of periodsResponse.data) {
                  const appraisalTitlesQuery = await baseQuery({
                     url: `/AppraisalTitle/ForPeriod/${periodItem.id}/${userId}`,
                     method: 'GET'
                  });

                  let titlesResponse = appraisalTitlesQuery.data as AppraisalResponseModel;
                  let appraisalTitles: [] = titlesResponse.appraisaltitle as [];

                  if (appraisalTitles.length > 0) {

                     let usableTitle = titlesResponse.appraisaltitle[0]; // we only use the first one...

                     // Now get the appraisal items for each appraisal title id
                     const appraisalsQuery = await baseQuery({
                        url: `/Appraisal/GetGoalListForAppriasal/${userId}/${usableTitle.id}`,
                        method: 'GET'
                     });

                     if (!appraisalsQuery.error) {

                        let appraisalsResponse = appraisalsQuery.data as ResponseModel;
                        let appraisals: IAppraisalModel[] = appraisalsResponse.data;


                        // Get the average of the review values
                        let selfReviewTotal = 0;
                        let managerReviewTotal = 0;
                        appraisals.forEach(x => {
                           selfReviewTotal += (x.actualResultSelf ? (x.actualResultSelf / 100) * x.weight : 0);
                           managerReviewTotal += (x.actualResultManager ? (x.actualResultManager / 100) * x.weight : 0);
                        });

                        // appraisals.forEach(appraisal => {
                        //    selfReviewTotal += appraisal.actualResultSelf;
                        //    managerReviewTotal += appraisal.actualResultManager;
                        // });

                        // let selfReviewAverage = selfReviewTotal / appraisals.length;
                        // let managerReviewAverage = managerReviewTotal / appraisals.length;

                        // Now we can build up a custom object for display purposes
                        result.data.push({
                           name: periodItem.title,
                           approvalStatus: periodItem.status,
                           selfReviewAverage: selfReviewTotal,
                           managerReviewAverage: managerReviewTotal,
                           created: usableTitle.createdTimestamp.toString(),
                           appraisalPeriodId: periodItem.id,
                           appraisalTitleId: usableTitle.id
                        })
                     }
                  }
               }

               return { data: result.data };
               // return { data: mockData };

            } catch (error: any) {
               console.error(`catch error`);
               console.log(error);
               debugger;
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getGoalForAppraisal: build.query<IAppraisalModel, IAppraisalSearchModel>({
         query: (appraisalSearch) => `/Appraisal/GetGoalForAppriasal/${appraisalSearch.goalId}/${appraisalSearch.userId}`,
         transformResponse: (rawResult: IAppraisalAPIModel, meta) => {
            const tmpDateValue = rawResult.goal.datecreated;
            const tmpTimeValue = rawResult.goal.timecreated;
            const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

            const transformedResult = {
               userId: rawResult.goal.createdby,
               id: rawResult.goal.id,
               kraId: parseInt(rawResult.goal.keyresultarea),
               timing: rawResult.goal.timing,
               weight: rawResult.goal.weight,
               priority: rawResult.goal.priority,
               createdTimestamp: tmpDateTime.getTime(),
               description: rawResult.goal.decription,
               measureOfSuccess: rawResult.goal.measureofsuccess,
               achievementCriteria: rawResult.goal.achievementcriteria,
               batchId: -1,
               actualResultSelf: parseFloat(rawResult.goal.actualresultSelf),
               actualResultManager: parseFloat(rawResult.goal.actualresultManager)
            };
            return transformedResult;
         },
      }),
      getGoalListForAppraisal: build.query<IAppraisalModel[], IAppraisalListSearchModel>({
         query: (appraisalListSearch) => `/Appraisal/GetGoalListForAppriasal/${appraisalListSearch.userId}/${appraisalListSearch.batchId}`,
         transformResponse: (rawResult: IAppraisalAPIModel, meta) => {
            const apiResult = rawResult.goalList.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

               const transformedResult = {
                  userId: x.createdby,
                  id: x.id,
                  kraId: parseInt(x.keyresultarea),
                  kraTitle: x.keyresultarea,
                  timing: x.timecreated,
                  weight: x.weight,
                  priority: x.priority,
                  createdTimestamp: tmpDateTime.getTime(),
                  description: x.decription,
                  measureOfSuccess: x.measureofsuccess,
                  achievementCriteria: x.achievementcriteria,
                  batchId: -1,
                  actualResultSelf: parseInt(x.actualresultSelf),
                  actualResultManager: parseInt(x.actualresultManager)
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      // RS: Not really sure what this method name even means?
      goalSelfAppraisal: build.mutation<IAppraisalAPIModel, Partial<ISelfAppraisalModel>>({
         query(item) {
            const body = {
               goalId: item.goalId,
               employeeId: item.employeeId,
               keyResultAreaId: item.keyResultAreaId,
               careerAspiration: item.careerAspiration,
               suggestedDevelopmentActions: item.suggestedDevelopmentActions,
            }
            return {
               url: `/Appraisal/GoalSelfAppraisal`,
               method: 'PUT',
               body: body
            };
         }
      }),
      goalSelfAppraisalActualResult: build.mutation<IAppraisalAPIModel, Partial<ISelfAppraisalActualResultModel>>({
         query(item) {
            const body = {
               goalId: item.goalId,
               employeeId: item.employeeId,
               keyResultAreaId: item.keyResultAreaId,
               actualResult: item.actualResult
            }
            return {
               url: `/Appraisal/GoalSelfAppraisalActualResult`,
               method: 'PUT',
               body: body
            };
         }
      }),
      saveManagerReviewAppraisal: build.mutation<IAppraisalAPIModel, Partial<IManagerReviewAppraisalSaveModel>>({
         query(item) {
            const body = {
               actualResult: item.actualResult
            }
            return {
               url: `/Appraisal/SaveManagerReviewAppraisal/${item.goalId}/${item.managerId}`,
               method: 'PUT',
               body: body
            };
         }
      }),
      // RS: This should have a better name to clearly indicate what the method does
      managerCareerAspirationReviewAppraisal: build.mutation<IAppraisalAPIModel, Partial<IManagerCareerAspirationReviewAppraisalModel>>({
         query(item) {
            const body = {
               goalId: item.goalId,
               managerId: item.managerId,
               careerOutlook: item.careerOutLook
            }
            return {
               url: `/Appraisal/ManagerCareerAspirationReviewAppraisal`,
               method: 'PUT',
               body: body
            };
         }
      }),
      saveManagerGeneralComment: build.mutation<IAppraisalAPIModel, Partial<IManagerGeneralCommentModel>>({
         query(item) {
            const body = {
               goalId: item.goaldId,
               generalComment: item.generalComment
            }
            return {
               url: `/Appraisal/SaveManagerGeneralComment`,
               method: 'PUT',
               body: body
            };
         }
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: appraisalEndpoints,
   useGetAppraisalGoalsQuery,
   useGetAppraisalsAsEmployeeQuery,
   useLazyGetAppraisalsAsEmployeeQuery,
   useGetAppraisalsAsReviewerQuery,
   useLazyGetAppraisalsAsReviewerQuery,
   useGetAppraisalReviewHistoryQuery,
   useSubmitAppraisalForApprovalMutation,
   useSaveAppraisalGoalReviewMutation,
   useSaveAppraisalReviewMutation,

   useGetAppraisalsByEmployeeIdQuery,
   useGetGoalForAppraisalQuery,
   useGetGoalListForAppraisalQuery,
   useGoalSelfAppraisalActualResultMutation,
   useSaveManagerReviewAppraisalMutation,
   useSaveManagerGeneralCommentMutation,
   useGoalSelfAppraisalMutation,
   useLazyGetGoalForAppraisalQuery,
   useLazyGetGoalListForAppraisalQuery,
   useManagerCareerAspirationReviewAppraisalMutation
} = appraisalService
