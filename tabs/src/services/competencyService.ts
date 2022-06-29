import { baseApi } from '.';
import mockCompetencies from '../common/mockData/mockCompetencies';
import { ICompetencyModel } from '../common/types/competency';
import { defaultErrors } from '../common/utils/commonVariables';
import { log } from '../common/utils/customConsoleLog';
import { sortBy } from '../common/utils/sharedFunctions';

export const competencyService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      createCompetency: build.mutation<ICompetencyModel, Partial<ICompetencyModel>>({
         query(body) {
            return {
               url: `competencies/createCompetency`,
               method: 'POST',
               body,
            };
         }
      }),
      getCompetency: build.query<ICompetencyModel, string>({
         // query: (id) => `competencies/getCompetency/${id}`,
         async queryFn(id, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockCompetencies.find(x => x.id === id);
               return result
                  ? { data: result }
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
      getAllCompetencies: build.query<ICompetencyModel[], void>({
         //query: (userUPN) => `competencies/getAllUserCompetencies/${userUPN}`,
         async queryFn(_void, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockCompetencies;
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
      updateCompetency: build.mutation<ICompetencyModel, Partial<ICompetencyModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `competencies/updateCompetency/${id}`,
               method: 'PATCH',
               body: item
            };
         },
         async onQueryStarted(item: Partial<ICompetencyModel>, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               competencyService.util.updateQueryData('getAllCompetencies', undefined, draftItems => {
                  const draftIndex = draftItems.findIndex((x: ICompetencyModel) => x.id === item.id);
                  if (draftIndex > 0) {
                     draftItems[draftIndex] = { ...item } as ICompetencyModel;
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
      deleteCompetency: build.mutation<boolean, Partial<ICompetencyModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `competencies/deleteCompetency/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(item: ICompetencyModel, { dispatch, queryFulfilled }) {
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               competencyService.util.updateQueryData('getAllCompetencies', undefined, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: ICompetencyModel) => x.id === item.id);
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
   endpoints: competencyEndpoints,
   useCreateCompetencyMutation,
   useGetCompetencyQuery,
   useGetAllCompetenciesQuery,
   useUpdateCompetencyMutation,
   useDeleteCompetencyMutation,
} = competencyService
