import { baseApi, IBaseApiResponse } from '../../services';
import {
    IAppraisalPeriodAPIModel, IAppraisalPeriodListAPIModel, IAppraisalPeriodModel, months
} from './types';

export const appraisalPeriodService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getAppraisalPeriod: build.query<IAppraisalPeriodModel, number>({
         query: (id) => `/AppraisalPeriod/GetAppraisalPeriodById/${id}`,
         transformResponse: (rawResult: IAppraisalPeriodListAPIModel, meta) => {
            const removedInvalidPeriods = rawResult.data.filter(x => x.month.includes(`-`) && x.month.split('-').length === 2 && !x.year.includes(`-`) && x.year.length === 4);

            const periodResult: IAppraisalPeriodModel[] = removedInvalidPeriods.map(x => {
               const startMonth = x.month.split('-')[0];
               const endMonth = x.month.split('-')[1];
               const periodEntry: IAppraisalPeriodModel = {
                  id: x.id,
                  title: `${x.month} ${x.year}`,
                  status: x.status === 'current' ? 'active' : 'inactive', //`${x.status}`,
                  startTimestamp: new Date(parseInt(x.year), months.indexOf(startMonth), 1).getTime(),
                  endTimestamp: new Date(parseInt(x.year), months.indexOf(endMonth), 1).getTime(),
                  startMonthIndex: months.indexOf(startMonth),
                  endMonthIndex: months.indexOf(endMonth),
                  year: parseInt(x.year),
                  reminderFrequency: 'daily',
                  active: x.status === 'current'
               };
               return periodEntry;
            });

            return periodResult[0];
         },
      }),
      getCurrentAppraisalPeriod: build.query<IAppraisalPeriodModel, void>({
         query: () => `/AppraisalPeriod/CurrentAppraisal`,
         transformResponse: (rawResult: IAppraisalPeriodListAPIModel, meta) => {
            try {
               const removedInvalidPeriods = rawResult.data.filter(x => x.month.includes(`-`) && x.month.split('-').length === 2 && !x.year.includes(`-`) && x.year.length === 4);

               if (removedInvalidPeriods.length === 0) {
                  throw new Error('Could not find the current appraisal period');
               }

               const periodResult: IAppraisalPeriodModel[] = removedInvalidPeriods.map(x => {
                  const startMonth = x.month.split('-')[0];
                  const endMonth = x.month.split('-')[1];
                  const periodEntry: IAppraisalPeriodModel = {
                     id: x.id,
                     title: `${x.month} ${x.year}`,
                     status: x.status === 'current' ? 'active' : 'inactive', //`${x.status}`,
                     startTimestamp: new Date(parseInt(x.year), months.indexOf(startMonth), 1).getTime(),
                     endTimestamp: new Date(parseInt(x.year), months.indexOf(endMonth), 1).getTime(),
                     startMonthIndex: months.indexOf(startMonth),
                     endMonthIndex: months.indexOf(endMonth),
                     year: parseInt(x.year),
                     reminderFrequency: '',
                     active: x.status === 'current'
                  };
                  return periodEntry;
               });
               return periodResult[0];
            } catch (error: any) {
               throw new Error('Appraisal period formatting is incorrect.');
            }
         },
      }),
      getAllAppraisalPeriods: build.query<IAppraisalPeriodModel[], void>({
         query: () => `/AppraisalPeriod`,
         transformResponse: (rawResult: IAppraisalPeriodListAPIModel, meta) => {
            const removedInvalidPeriods = rawResult.data.filter(x => x.month.includes(`-`) && x.month.split('-').length === 2 && !x.year.includes(`-`) && x.year.length === 4);
// TODO: remove STATUS FILTER
            const periodResult: IAppraisalPeriodModel[] = removedInvalidPeriods.map(x => {
               const startMonth = x.month.split('-')[0];
               const endMonth = x.month.split('-')[1];
               const periodEntry: IAppraisalPeriodModel = {
                  id: x.id,
                  title: `${x.month} ${x.year}`,
                  status: x.status === 'current' ? 'active' : 'inactive', //`${x.status}`,
                  startTimestamp: new Date(parseInt(x.year), months.indexOf(startMonth), 1).getTime(),
                  endTimestamp: new Date(parseInt(x.year), months.indexOf(endMonth), 1).getTime(),
                  startMonthIndex: months.indexOf(startMonth),
                  endMonthIndex: months.indexOf(endMonth),
                  year: parseInt(x.year),
                  reminderFrequency: '',
                  active: x.status === 'current'
               };
               return periodEntry;
            });

            return periodResult;
         },
      }),
      createAppraisalPeriod: build.mutation<IBaseApiResponse, Partial<IAppraisalPeriodModel> & { userId?: number }>({
         query(item) {
            const body = {
               year: `${item.year}`,
               month: `${months[item.startMonthIndex!]}-${months[item.endMonthIndex!]}`,
               active: item.active,
               // active: item.status === "active",
               createdbyfk: item.userId || 0
            }
            return {
               url: `/AppraisalPeriod/CreateAppraisalPeriod`,
               method: 'POST',
               body,
            };
         }
      }),
      updateAppraisalPeriod: build.mutation<IAppraisalPeriodListAPIModel, IAppraisalPeriodModel & { userId?: number }>({
         query(item) {
            const { id } = item;
            const body = {
               year: `${item.year}`,
               month: `${months[item.startMonthIndex]}-${months[item.endMonthIndex]}`,
               active: item.active,
               createdbyfk: item.userId || 0
            }
            return {
               url: `/AppraisalPeriod/UpdateAppraisalPeriod/${id}`,
               method: 'PUT',
               body
            };
         }
      }),
      deleteAppraisalPeriod: build.mutation<IAppraisalPeriodListAPIModel, number>({
         query(id) {
            return {
               url: `/AppraisalPeriod/DeleteAppraisalPeriod/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(_arg: number, { dispatch, queryFulfilled }) {
            const itemId = _arg;
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               appraisalPeriodService.util.updateQueryData('getAllAppraisalPeriods', undefined, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: IAppraisalPeriodModel) => x.id === itemId);
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
   endpoints: appraisalPeriodEndpoints,
   useGetAppraisalPeriodQuery,
   useGetCurrentAppraisalPeriodQuery,
   useGetAllAppraisalPeriodsQuery,
   useLazyGetAllAppraisalPeriodsQuery,
   useCreateAppraisalPeriodMutation,
   useUpdateAppraisalPeriodMutation,
   useDeleteAppraisalPeriodMutation,
} = appraisalPeriodService
