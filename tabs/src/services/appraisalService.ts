import { baseApi } from '.';
import mockAppraisals from '../common/mockData/mockAppraisals';
import mockUsers from '../common/mockData/mockUsers';
import { IAppraisalModel } from '../common/types/appraisal';
import { defaultErrors } from '../common/utils/commonVariables';
import { log } from '../common/utils/customConsoleLog';
import { sortBy } from '../common/utils/sharedFunctions';

export const appraisalService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      createAppraisal: build.mutation<IAppraisalModel, Partial<IAppraisalModel>>({
         query(body) {
            return {
               url: `appraisals/createAppraisal`,
               method: 'POST',
               body,
            };
         }
      }),
      getAppraisal: build.query<IAppraisalModel, string>({
         query: (id) => `appraisals/getAppraisal/${id}`,
      }),
      getAllAppraisalsByApprsaisalPeriodId: build.query<IAppraisalModel[], string>({
         query: (id) => `appraisals/getAllAppraisalsByApprsaisalPeriodId/${id}`,
      }),
      getAllAppraisals: build.query<IAppraisalModel[], void>({
         //query: (userUPN) => `appraisals/getAllUserAppraisals/${userUPN}`,
         async queryFn(_naN, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockAppraisals;
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
      getAllUserAppraisals: build.query<IAppraisalModel[], string>({
         //query: (userUPN) => `goals/getAllUserGoals/${userUPN}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockAppraisals.filter(x => x.creatorUPN === userUPN);
               //result = transformResult(result);
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
      getAllMyEmployeesAppraisals: build.query<IAppraisalModel[], string>({
         // query: (userUPN) => `goals/getAllMyEmployeesAppraisals/${userUPN}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let myEmployeesUPN = mockUsers.filter(u => u.managers.map(m => m.upn).includes(userUPN)).map(u => u.upn);
               let result = mockAppraisals.filter(g => myEmployeesUPN.includes(g.creatorUPN) && g.status === 'submitted');
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
      updateAppraisal: build.mutation<IAppraisalModel, Partial<IAppraisalModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `appraisals/updateAppraisal/${id}`,
               method: 'PATCH',
               body: item
            };
         },
         async onQueryStarted(item: Partial<IAppraisalModel>, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               appraisalService.util.updateQueryData('getAllAppraisals', undefined, draftItems => {
                  const draftIndex = draftItems.findIndex((x: IAppraisalModel) => x.id === item.id);
                  if (draftIndex > 0) {
                     draftItems[draftIndex] = { ...item } as IAppraisalModel;
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
      deleteAppraisal: build.mutation<boolean, IAppraisalModel>({
         query(item) {
            const { id } = item;
            return {
               url: `appraisals/deleteAppraisal/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(item: IAppraisalModel, { dispatch, queryFulfilled }) {
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               appraisalService.util.updateQueryData('getAllAppraisals', undefined, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: IAppraisalModel) => x.id === item.id);
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
   endpoints: appraisalEndpoints,
   useCreateAppraisalMutation,
   useGetAppraisalQuery,
   useGetAllUserAppraisalsQuery,
   useGetAllMyEmployeesAppraisalsQuery,
   useGetAllAppraisalsByApprsaisalPeriodIdQuery,
   useGetAllAppraisalsQuery,
   useUpdateAppraisalMutation,
   useDeleteAppraisalMutation,
} = appraisalService
