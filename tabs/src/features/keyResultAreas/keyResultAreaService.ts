import { baseApi, IBaseApiResponse } from '../../services';
import { IKeyResultAreaAPIModel, IKeyResultAreaListAPIModel, IKeyResultAreaModel } from './types';

export const keyResultAreaService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getKeyResultArea: build.query<IKeyResultAreaModel, number>({
         query: (id) => `/KeyResultArea/KRAById/${id}`,
         transformResponse: (rawResult: IKeyResultAreaAPIModel, meta) => {
            const transformedResult:IKeyResultAreaModel = {
               id: rawResult.keyreultareas.id,
               title: rawResult.keyreultareas.keyresultarea,
               createdby: rawResult.keyreultareas.createdby || 0,
            }
            return transformedResult;
         },
      }),
      getAllKeyResultAreas: build.query<IKeyResultAreaModel[], void>({
         query: () => `/KeyResultArea/GetAllKRA`,
         transformResponse: (rawResult: IKeyResultAreaListAPIModel, meta) => {
            const transformedResult = rawResult.keyreultareas.map(x => ({
               id: x.id,
               title: x.keyresultarea,
               createdby: x.createdby,
            } as IKeyResultAreaModel));
            return transformedResult;
         },
      }),
      createKeyResultArea: build.mutation<IBaseApiResponse, Partial<IKeyResultAreaModel>>({
         query(item) {
            const body = {
               keyresultarea: item.title,
               createdby: item.createdby,
            }
            return {
               url: `/KeyResultArea/CreateKRA`,
               method: 'POST',
               body,
            };
         },
         transformResponse: (rawResult: IKeyResultAreaListAPIModel, meta) => {
            if(rawResult.keyreultareas.length === 0) {
               return {
                  data: null,
                  status: rawResult.status,
                  message: rawResult.message,
               }
            }
            const transformedResult = rawResult.keyreultareas.map(x => ({
               id: x.id,
               title: x.keyresultarea,
               createdby: x.createdby,
            } as IKeyResultAreaModel));
            return {
               data: transformedResult[0],
               status: rawResult.status,
               message: rawResult.message,
            }
         },
      }),
      updateKeyResultArea: build.mutation<IKeyResultAreaListAPIModel, Partial<IKeyResultAreaModel>>({
         query(item) {
            const body = {
               keyresultarea: item.title,
               createdby: item.createdby,
            }
            return {
               url: `/KeyResultArea/UpdateKRA/${item.id}`,
               method: 'PUT',
               body
            };
         }
      }),
      deleteKeyResultArea: build.mutation<IKeyResultAreaListAPIModel, number>({
         query(id) {
            return {
               url: `/KeyResultArea/DeleteKRA/${id}`,
               method: 'DELETE'
            };
         }
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: keyResultAreaEndpoints,
   useGetKeyResultAreaQuery,
   useGetAllKeyResultAreasQuery,
   useLazyGetAllKeyResultAreasQuery,
   useCreateKeyResultAreaMutation,
   useUpdateKeyResultAreaMutation,
   useDeleteKeyResultAreaMutation,
} = keyResultAreaService
