import {
    BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

import { getApiBaseUrl } from '../common/utils/sharedFunctions';
import { RootState } from '../store';

export interface IBaseApiResponse {
   data?: any;
   status: string,
   message: string,
}

export const baseApi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: getApiBaseUrl(),
      prepareHeaders: (headers, { getState }) => {
         // By default, if we have a token in the store, let's use that for authenticated requests
         const token = (getState() as RootState).sessionCtx.token
         if (token) {
            headers.set('Authorization', `Bearer ${token}`)
         }
         return headers
      },
   }),
   endpoints: () => ({}),
});

export const baseGraphApi = createApi({
   reducerPath: "graphapi",
   baseQuery: fetchBaseQuery({ baseUrl: `` }),
   endpoints: () => ({}),
});

const baseQuery = fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_NOTIFICATION_API}`, });
const apiBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
   let result;
   const queryCode = `${process.env.REACT_APP_NOTIFICATION_API_CODE}`;
   if (typeof args === "string") {
      result = await baseQuery(`args?code=${queryCode}`, api, extraOptions);
   } else {
      const argsWithQuery = {
         ...args,
         params: {code: queryCode},
      }
      result = await baseQuery(argsWithQuery, api, extraOptions);
   }
   return result;
}

export const baseNotificationApi = createApi({
   reducerPath: "notification",
   baseQuery: apiBaseQuery,
   endpoints: () => ({}),
});