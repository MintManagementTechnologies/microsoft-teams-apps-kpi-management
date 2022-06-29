import { baseApi, IBaseApiResponse } from '../../services';
import { ICompetencyAPIModel, ICompetencyListAPIModel, ICompetencyModel } from './types';

export const competencyService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getCompetency: build.query<ICompetencyModel, number>({
         query: (id) => `/KeyResultAreaCompetence/GetKRA/${id}`,
         transformResponse: (rawResult: ICompetencyListAPIModel, meta) => {
            const apiResult = rawResult.kracompetence.map(x => ({
               kraId: x.keyarearesultfk,
               kraTitle: x.keyresultarea,
               workgradeId: x.workgradefk,
               title: x.competence,
               description: x.description,
               weight: x.weight,
               id: x.id
            }));
            return apiResult[0];
         },
      }),
      getCompetenciesByWorkgrade: build.query<ICompetencyModel[], number>({
         query: (workgradeId) => `/KeyResultAreaCompetence/GetKRACompetencesByWorkGrade/${workgradeId}`,
         transformResponse: (rawResult: ICompetencyListAPIModel, meta) => {
            const apiResult = rawResult.kracompetence.map(x => ({
               kraId: x.keyarearesultfk,
               kraTitle: x.keyresultarea,
               workgradeId: x.workgradefk,
               title: x.competence,
               description: x.description,
               weight: x.weight,
               id: x.id
            }));
            return apiResult;
         },
      }),
      createCompetency: build.mutation<ICompetencyListAPIModel, Partial<ICompetencyModel> & { userId?: number }>({
         query(item) {
            const body = {
               keyarearesultfk: item.kraId,
               workgradefk: item.workgradeId,
               competence: item.title,
               description: item.description,
               weight: item.weight,
               createdbyfk: item.userId || 0
            }
            return {
               url: `/KeyResultAreaCompetence/CreateKRA`,
               method: 'POST',
               body,
            };
         }
      }),
      updateCompetency: build.mutation<ICompetencyListAPIModel, ICompetencyModel & { userId?: number }>({
         query(item) {
            const { id } = item;
            const body = {
               keyarearesultfk: item.kraId,
               workgradefk: item.workgradeId,
               competence: item.title,
               description: item.description,
               weight: item.weight,
               createdby: item.userId || 0
            }
            return {
               url: `/KeyResultAreaCompetence/UpdateKRA/${id}`,
               method: 'PUT',
               body
            };
         }
      }),
      deleteCompetency: build.mutation<ICompetencyListAPIModel, number>({
         query(id) {
            return {
               url: `/KeyResultAreaCompetence/DeleteKRA/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(_arg: number, { dispatch, queryFulfilled }) {
            const itemId = _arg;
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               competencyService.util.updateQueryData('getCompetenciesByWorkgrade', _arg, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: ICompetencyModel) => x.id === itemId);
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
   endpoints: competencyEndpoints,
   useGetCompetencyQuery,
   useGetCompetenciesByWorkgradeQuery,
   useLazyGetCompetenciesByWorkgradeQuery,
   useCreateCompetencyMutation,
   useUpdateCompetencyMutation,
   useDeleteCompetencyMutation,
} = competencyService
