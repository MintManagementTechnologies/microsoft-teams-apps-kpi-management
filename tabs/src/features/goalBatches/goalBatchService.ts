import { getStatusAndApprovalLevel } from '../../common/utils/configVariables';
import { baseApi, IBaseApiResponse } from '../../services';
import mockData from './mockData';
// import mockData from './mockData';
import {
    IGoalBatchApproveModel, IGoalBatchListAPIModel, IGoalBatchModel, IGoalBatchSearchModel,
    newGoalBatch
} from './types';

export const goalBatchService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getGoalBatch: build.query<IGoalBatchModel, IGoalBatchSearchModel>({
         query: (arg) => `/AppraisalTitle/ForPeriod/${arg.appraisalPeriodId}/${arg.userId}`,
         transformResponse: (rawResult: IGoalBatchListAPIModel, meta) => {
            // if(rawResult.appraisaltitle.length === 0){
            //    console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            //    console.error('goalBatchService -> getGoalBatch');
            //    console.log('using mockData...');
            //    return mockData[0];
            // }

            // No goalBatch found. User needs to create a new goalBatch first.
            if(rawResult.appraisaltitle.length === 0){
               return newGoalBatch;
            }
            const apiResult = rawResult.appraisaltitle.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
               const { currentLevel, currentStatus } = getStatusAndApprovalLevel(x.status);
               const transformedResult = {
                  id: x.id,
                  title: x.title,
                  status: currentStatus,
                  currentLevel: currentLevel,
                  userId: x.empfk,
                  appraisalPeriodId: x.appraisalPeriodfk,
                  createdTimestamp: tmpDateTime.getTime()
               };
               return transformedResult;
            });
            return apiResult[0];
         },
      }),
      getAllGoalBatches: build.query<IGoalBatchModel[], void>({
         query: () => `/AppraisalTitle/GetAllAppraisalTitle`,
         transformResponse: (rawResult: IGoalBatchListAPIModel, meta) => {
            // if(rawResult.appraisaltitle.length === 0){
            //    console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            //    console.error('goalBatchService -> getAllGoalBatches');
            //    console.log('using mockData...');
            //    return mockData;
            // }
            const apiResult = rawResult.appraisaltitle.filter(z => z.performanceManagementStage === 'Goal Setting').map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
               const { currentLevel, currentStatus } = getStatusAndApprovalLevel(x.status);

               const transformedResult = {
                  id: x.id,
                  title: x.title,
                  status: currentStatus,
                  currentLevel: currentLevel,
                  userId: x.empfk,
                  appraisalPeriodId: x.appraisalPeriodfk,
                  createdTimestamp: tmpDateTime.getTime()
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      getGoalBatchesByAppraisalPeriodAndEmployee: build.query<IGoalBatchModel[], { userId: number, appraisalPeriodId: number }>({
         query: (arg) => `/AppraisalTitle/ForPeriod/${arg.appraisalPeriodId}/${arg.userId}`,
         transformResponse: (rawResult: IGoalBatchListAPIModel, meta) => {
            // TODO: Remove mockData
            // if(rawResult.appraisaltitle.length === 0){
            //    console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            //    console.error('goalBatchService -> getGoalBatchesByAppraisalPeriodAndEmployee');
            //    console.log('using mockData...');
            //    return mockData;
            // }
            const apiResult = rawResult.appraisaltitle.filter(z => z.performanceManagementStage === 'Goal Setting').map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
               const { currentLevel, currentStatus } = getStatusAndApprovalLevel(x.status);

               const transformedResult = {
                  id: x.id,
                  title: x.title,
                  status: currentStatus,
                  currentLevel: currentLevel,
                  userId: x.empfk,
                  appraisalPeriodId: x.appraisalPeriodfk,
                  createdTimestamp: tmpDateTime.getTime()
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      getGoalBatchesPendingApproval: build.query<IGoalBatchModel[], { userId: number, appraisalPeriodId: number }>({
         query: (arg) => `/AppraisalTitle/PendingApprovals/${arg.appraisalPeriodId}/${arg.userId}`,
         transformResponse: (rawResult: IGoalBatchListAPIModel, meta) => {
            // TODO: Remove mockData
            // if(rawResult.appraisaltitle.length === 0){
               // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
               // console.error('goalBatchService -> getGoalBatchesPendingApproval');
               // console.log('using mockData...');
               // return mockData;
            // }
            const apiResult = rawResult.appraisaltitle.filter(z => z.performanceManagementStage === 'Goal Setting').map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);
               const { currentLevel, currentStatus } = getStatusAndApprovalLevel(x.status);

               const transformedResult = {
                  id: x.id,
                  title: x.title,
                  status: currentStatus,
                  currentLevel: currentLevel,
                  userId: x.empfk,
                  appraisalPeriodId: x.appraisalPeriodfk,
                  createdTimestamp: tmpDateTime.getTime()
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      submitGoalBatchForApproval: build.mutation<IGoalBatchListAPIModel, Partial<IGoalBatchModel>>({
         query(item) {
            const { id, userId } = item;
            return {
               url: `/Approvals/EmployeeGoalSubmission/${id}?takenby=${userId}`,
               method: 'PUT',
            };
         },
      }),
      approveGoalBatch: build.mutation<IGoalBatchListAPIModel, IGoalBatchApproveModel>({
         query(item) {
            const { id, approverId, approved, comments } = item;
            const body = {
               approvedBy: approverId,
               isApproved: approved,
               comment: comments
            }
            return {
               url: `/Approvals/GoalsApproval/${id}`,
               method: 'PUT',
               body
            };
         },
      }),
      createGoalBatch: build.mutation<IGoalBatchListAPIModel, { appraisalPeriodId: number } & any>({
         query(item) {
            // bug - Why am I sending this?
            const manager1 = item.managers?.find((x: any) => x.order === 0);
            const manager2 = item.managers?.find((x: any) => x.order === 1);

            const body = {
               appraisalPeriodfk: item.appraisalPeriodId,
               empfk: item.id,
               title: "NaN",
               linemanager: manager1 ? manager1.id : 0,
               seclinemanager: manager2 ? manager2.id : 0,
               cnamefk: item.companyId,
               jobtitlefk: item.jobTitleId,
               deptfk: item.departmentId
            }
            return {
               url: `/AppraisalTitle/CreateAppraisalTitle`,
               method: 'POST',
               body,
            };
         },
      }),
      updateGoalBatch: build.mutation<IGoalBatchListAPIModel, { appraisalPeriodId: number } & any>({
         query(item) {
            const { id } = item;
            // bug - Why am I sending this?
            const manager1 = item.managers?.find((x: any) => x.order === 0);
            const manager2 = item.managers?.find((x: any) => x.order === 1);

            const body = {
               appraisalPeriodfk: item.appraisalPeriodId,
               empfk: item.id,
               title: "NaN",
               linemanager: manager1 ? manager1.id : 0,
               seclinemanager: manager2 ? manager2.id : 0,
               cnamefk: item.companyId,
               jobtitlefk: item.jobTitleId,
               deptfk: item.departmentId
            }
            return {
               url: `/AppraisalTitle/UpdateAppraisalTitle/${id}`,
               method: 'PUT',
               body
            };
         }
      }),
      deleteGoalBatch: build.mutation<IGoalBatchListAPIModel, number>({
         query(id) {
            return {
               url: `/AppraisalTitle/DeleteAppraisalTitle/${id}`,
               method: 'DELETE'
            };
         },
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: goalBatchEndpoints,
   useGetGoalBatchQuery,
   useLazyGetGoalBatchQuery,
   useGetAllGoalBatchesQuery,
   useLazyGetAllGoalBatchesQuery,
   useGetGoalBatchesByAppraisalPeriodAndEmployeeQuery,
   useLazyGetGoalBatchesByAppraisalPeriodAndEmployeeQuery,
   useGetGoalBatchesPendingApprovalQuery,
   useLazyGetGoalBatchesPendingApprovalQuery,
   useSubmitGoalBatchForApprovalMutation,
   useApproveGoalBatchMutation,
   useCreateGoalBatchMutation,
   useUpdateGoalBatchMutation,
   useDeleteGoalBatchMutation,
} = goalBatchService
