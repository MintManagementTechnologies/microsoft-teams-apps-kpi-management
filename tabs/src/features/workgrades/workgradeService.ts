import { baseApi } from '../../services';
import { IWorkgradeListAPIModel, IWorkgradeModel } from './types';

export const workgradeService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getAllWorkgrades: build.query<IWorkgradeModel[], void>({
         query: () => `/Company/GetAllWorkgrades`,
         transformResponse: (rawResult: IWorkgradeListAPIModel, meta) => {
            const apiResult = rawResult.workgrade.map(x => ({
               title: x.workgrade,
               id: x.id
            }));
            return apiResult;
         },
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: workgradeEndpoints,
   useGetAllWorkgradesQuery,
} = workgradeService
