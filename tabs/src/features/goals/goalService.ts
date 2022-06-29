import { baseApi, IBaseApiResponse } from '../../services';
// import mockData, { myGoalsMockData } from './mockData';
import { IGoalAPIModel, IGoalListAPIModel, IGoalModel } from './types';

export const goalService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getGoal: build.query<IGoalModel, number>({
         query: (id) => `/Goals/GoalById/${id}`,
         transformResponse: (rawResult: IGoalAPIModel, meta) => {
            // if(!rawResult.data){
            //    console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            //    console.error('goalService -> getGoalsByBatchId');
            //    console.log('using mockData...');
            //    return mockData[0];
            // }
            const tmpDateValue = rawResult.data.datecreated;
            const tmpTimeValue = rawResult.data.timecreated;
            const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

            const transformedResult = {
               userId: rawResult.data.empfk,
               id: rawResult.data.id,
               kraTitle: rawResult.data.keyresultarea,
               kraId: rawResult.data.keyresultareafk,
               timing: rawResult.data.timing,
               weight: rawResult.data.weight,
               priority: rawResult.data.priority,
               createdTimestamp: tmpDateTime.getTime(),
               description: rawResult.data.decription,
               measureOfSuccess: rawResult.data.measureofsuccess,
               achievementCriteria: rawResult.data.achievementcriteria,
               batchId: rawResult.data.appraisalTitleId
            };
            return transformedResult;
         },
      }),
      getGoalsByEmployee: build.query<IGoalModel[], number>({
         query: (id) => `/Goals/AllEmployeeGoals/${id}`,
         transformResponse: (rawResult: IGoalListAPIModel, meta) => {
            // if(!rawResult.data || rawResult.data.length === 0){
               // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
               // console.error('goalService -> getGoalsByEmployee');
               // console.log('using myGoalsMockData...');
               // return myGoalsMockData;
            // }
            const apiResult = rawResult.data.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

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
                  batchId: x.appraisalTitleId
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      getGoalsByAppraisalPeriod: build.query<IGoalModel[], number>({
         query: (id) => `/Goals/GetAppraisalPeriodGoals/${id}`,
         transformResponse: (rawResult: IGoalListAPIModel, meta) => {
            // if(!rawResult.data || rawResult.data.length === 0){
               // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
               // console.error('goalService -> getGoalsByAppraisalPeriod');
               // console.log('using mockData...');
               // return mockData;
            // }
            const apiResult = rawResult.data.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

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
                  batchId: x.appraisalTitleId
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      getGoalsByBatchId: build.query<IGoalModel[], number>({
         query: (id) => `/Goals/GetGoalsForTitle/${id}`,
         transformResponse: (rawResult: IGoalListAPIModel, meta) => {
            // if(!rawResult.data || rawResult.data.length === 0){
            //    console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            //    console.error('goalService -> getGoalsByBatchId');
            //    console.log('using mockData...');
            //    return mockData;
            // }
            const apiResult = rawResult.data.map(x => {
               const tmpDateValue = x.datecreated;
               const tmpTimeValue = x.timecreated;
               const tmpDateTime = new Date(`${tmpDateValue} ${tmpTimeValue}`);

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
                  batchId: x.appraisalTitleId
               };
               return transformedResult;
            });
            return apiResult;
         },
      }),
      createGoal: build.mutation<IBaseApiResponse, Partial<IGoalModel>>({
         query(item) {
            const body = {
               appraisalTitleId: item.batchId,
               empfk: item.userId,
               keyresultarea: item.kraId,
               decription: item.description,
               measureofsuccess: item.measureOfSuccess,
               timing: item.timing,
               weight: item.weight,
               achievementcriteria: item.achievementCriteria,
               priority: item.priority
            }
            // {
            //    "appraisalTitleId": 0,
            //    "empfk": 0,
            //    "keyresultarea": 0,
            //    "decription": "string",
            //    "measureofsuccess": "string",
            //    "timing": "string",
            //    "weight": 0,
            //    "achievementcriteria": "string",
            //    "priority": 0
            //  }
            return {
               url: `/Goals/CreateGoal`,
               method: 'POST',
               body,
            };
         }
      }),
      updateGoal: build.mutation<IGoalListAPIModel, Partial<IGoalModel>>({
         query(item) {
            const { id } = item;
            const body = {
               appraisalTitleId: item.batchId,
               empfk: item.userId,
               keyresultarea: item.kraId,
               decription: item.description,
               measureofsuccess: item.measureOfSuccess,
               timing: item.timing,
               weight: item.weight,
               achievementcriteria: item.achievementCriteria,
               priority: item.priority
            }
            return {
               url: `/Goals/UpdateGoal/${id}`,
               method: 'PUT',
               body
            };
         }
      }),
      deleteGoal: build.mutation<IGoalListAPIModel, number>({
         query(id) {
            return {
               url: `/Goals/DeleteGoal/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(_arg: number, { dispatch, queryFulfilled }) {
            const itemId = _arg;
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               goalService.util.updateQueryData('getGoalsByEmployee', _arg, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: IGoalModel) => x.id === itemId);
                  //delete draftItems[draftIndex];
                  if (draftIndex > -1) {
                     draftItems.splice(draftIndex, 1);
                  }
               })
            )
            try {
               await queryFulfilled
            } catch {
               patchResult.undo()
            }
         },
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: goalEndpoints,
   useGetGoalQuery,
   useGetGoalsByEmployeeQuery,
   useLazyGetGoalsByEmployeeQuery,
   useGetGoalsByAppraisalPeriodQuery,
   useLazyGetGoalsByAppraisalPeriodQuery,
   useGetGoalsByBatchIdQuery,
   useLazyGetGoalsByBatchIdQuery,
   useCreateGoalMutation,
   useUpdateGoalMutation,
   useDeleteGoalMutation,
} = goalService
