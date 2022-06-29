import mockGoals from '../../common/mockData/mockGoals';
import mockUsers from '../../common/mockData/mockUsers';
import { defaultErrors } from '../../common/utils/commonVariables';
import { log } from '../../common/utils/customConsoleLog';
import { sortBy } from '../../common/utils/sharedFunctions';
import { baseApi } from '../../services';
import { IGoalModel } from './types';

const transformResult = (rawData: IGoalModel[]): IGoalModel[] => {
   return rawData.map(x => {
      const kraItems = rawData.filter(y => y.userUPN === x.userUPN && y.kraId === x.kraId);
      const initialValue = 0;
      const totalGoalBatchWeight = kraItems.reduce(
         (previousValue, currentItem) => previousValue + currentItem.weight,
         initialValue
      );
      return {
         ...x,
         kraTotalWeight: totalGoalBatchWeight,
         kraGroupByTitle: `${x.kraTitle} (${totalGoalBatchWeight}%)`,
         // user: {
         //    ...mockUsers!.find(y => (y.upn === x.userUPN)),
         //    status: x.status,
         //    batchStatus: x.batchStatus,
         //    batchTotalLevels: x.batchTotalLevels,
         //    batchCurrentLevel: x.batchCurrentLevel
         // }
      }
   }) as IGoalModel[];
}

export const goalServiceOld = baseApi.injectEndpoints({
   endpoints: (build) => ({
      createGoalOld: build.mutation<IGoalModel, Partial<IGoalModel>>({
         query(body) {
            return {
               url: `goals/createGoal`,
               method: 'POST',
               body,
            };
         }
      }),
      getGoalOld: build.query<IGoalModel, string>({
         query: (id) => `goals/getGoal/${id}`,
      }),
      getAllGoalsByAppraisalIdOld: build.query<IGoalModel[], string>({
         // query: (id) => `goals/getAllGoalsByAppraisalId/${id}`,
         async queryFn(appraisalId, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockGoals.filter(g => g.batchId === appraisalId);
               result = transformResult(result);
               return result
                  ? { data: result.sort((a, b) => sortBy(a.title, b.title)) }
                  : defaultErrors.rtkApi.NOTFOUND.USERGOALS
            } catch (error: any) {
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getAllUserGoalsOld: build.query<IGoalModel[], string>({
         //query: (userUPN) => `goals/getAllUserGoals/${userUPN}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockGoals.filter(g => g.userUPN === userUPN);
               result = transformResult(result);
               return result
                  ? { data: result.sort((a:any, b:any) => sortBy(a.kraId, b.kraId)) }
                  // ? { data: result.sort((a, b) => sortBy(a.title, b.title)) }
                  : defaultErrors.rtkApi.NOTFOUND.USERGOALS
            } catch (error: any) {
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getAllMyEmployeesGoalsOld: build.query<IGoalModel[], string>({
         // query: (userUPN) => `goals/getAllMyEmployeesGoals/${userUPN}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let myEmployeesUPN = mockUsers.filter(u => u.managers.map(m => m.upn).includes(userUPN)).map(u => u.upn);
               let result = mockGoals.filter(g => myEmployeesUPN.includes(g.userUPN) && g.batchStatus === 'submitted');
               result = transformResult(result);
               return result
                  ? { data: result.sort((a, b) => sortBy(a.title, b.title)) }
                  : defaultErrors.rtkApi.NOTFOUND.MYEMPLOYEESGOALS
            } catch (error: any) {
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         },
      }),
      getAllAppraisalPeriodGoalsOld: build.query<IGoalModel[], string>({
         // query: (id) => `goals/getAllAppraisalPeriodGoals/${id}`,
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockGoals.filter(g => g.appraisalPeriodId === _arg && g.batchStatus === 'submitted');
               result = transformResult(result);
               return result
                  ? { data: result.sort((a, b) => sortBy(a.title, b.title)) }
                  : defaultErrors.rtkApi.NOTFOUND.MYEMPLOYEESGOALS
            } catch (error: any) {
               return {
                  error: {
                     status: error.statusCode,
                     error: error.message
                  }
               }
            }
         }
      }),
      updateGoalOld: build.mutation<IGoalModel, Partial<IGoalModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `goals/updateGoal/${id}`,
               method: 'PATCH',
               body: item
            };
         },
         async onQueryStarted(item: Partial<IGoalModel>, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               goalServiceOld.util.updateQueryData('getAllUserGoalsOld', item.userUPN!, draftItems => {
                  const draftIndex = draftItems.findIndex((x: IGoalModel) => x.id === item.id);
                  if (draftIndex > 0) {
                     draftItems[draftIndex] = { ...item } as IGoalModel;
                  }
               })
            )
            try {
               await queryFulfilled
            } catch {
               patchResult.undo()
            }
         }
      }),
      deleteGoalOld: build.mutation<boolean, IGoalModel>({
         query(item) {
            const { id } = item;
            return {
               url: `goals/deleteGoal/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(item: IGoalModel, { dispatch, queryFulfilled }) {
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               goalServiceOld.util.updateQueryData('getAllUserGoalsOld', item.id, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: IGoalModel) => x.id === item.id);
                  delete draftItems[draftIndex];
               })
            )
            try {
               await queryFulfilled
            } catch {
               patchResult.undo()
            }
         }
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: goalEndpointsOld,
   useCreateGoalOldMutation,
   useGetGoalOldQuery,
   useGetAllGoalsByAppraisalIdOldQuery,
   useGetAllUserGoalsOldQuery,
   useGetAllMyEmployeesGoalsOldQuery,
   useGetAllAppraisalPeriodGoalsOldQuery,
   useUpdateGoalOldMutation,
   useDeleteGoalOldMutation,
} = goalServiceOld;