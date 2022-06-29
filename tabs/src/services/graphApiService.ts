
import { Client } from '@microsoft/microsoft-graph-client';

import { IGraphBatchResult, IGraphUserResult } from '../common/types/graphApiResult';
import { IUserModel } from '../common/types/user';
import { defaultErrors } from '../common/utils/commonVariables';
import { cacher } from '../common/utils/rtkQueryCacheUtils';
import { RootState } from '../store';
import { baseGraphApi } from './';

let _graph: Client | any = null;
export const setClientInstance = (client: Client) => {
   if (!_graph && client) {
      _graph = client;
   } else {
      if (_graph)
         console.error("already there, sjoe");
      else
         console.error("whoops...");
   }
}

interface tmpUserResult extends IGraphUserResult {
   activity?: string,
   availability?: string,
   image?: string
}

const getBatchUserPresenceAndPhotos =
   async (users: IGraphUserResult[], graph: Client)
      : Promise<(IGraphUserResult & { activity?: string, availability?: string, image?: string })[]> => {
      let batchRequest = {
         requests: users.filter((x: IGraphUserResult) => !x.userPrincipalName.includes('#')).map((x: IGraphUserResult, index: number) => (
            {
               id: x.id,
               method: "GET",
               url: `/users/${x.id}/photos/48x48/$value`,
               headers: {
                  "Content-Type": "image/jpg"
               }
            })) as any[]
      }
      let presencerequestBody = { ids: users.filter((x: IGraphUserResult) => !x.userPrincipalName.includes('#')).map((x: IGraphUserResult) => x.id) };
      batchRequest.requests.push({
         id: 'presenceRequest',
         method: "POST",
         url: `/communications/getPresencesByUserId`,
         body: presencerequestBody,
         headers: {
            "Content-Type": "application/json"
         }
      });

      let batchResults: IGraphBatchResult = await graph.api('/$batch').post(batchRequest).catch((error: any) => {
         console.error('GraphClient - getBatchUsersPhotoAndPresence - Batch Request');
         console.error(error.statusCode);
      });

      return users.map((x: IGraphUserResult) => {
         if (x.userPrincipalName.includes('#'))
            return x;
         const imageBatchResponse = batchResults.responses.find((y: any) => y.id === x.id);
         let hasImage = false;
         if (imageBatchResponse) hasImage = imageBatchResponse.status === 200;

         const blobUrl = imageBatchResponse && hasImage ? `data:image/jpg;base64,${imageBatchResponse.body}` : undefined;

         const presenceBatchResponse = batchResults.responses.find((y: any) => y.id === 'presenceRequest');
         const availability = presenceBatchResponse ?
            presenceBatchResponse.body.value.find((y: any) => y.id === x.id).availability
            : 'PresenceUnknown';

         return {
            activity: availability,
            availability: availability,
            image: blobUrl,
            ...x
         }
      })
   }

const transformUserBatchResult = (rawData: tmpUserResult[]): IUserModel[] => {
   return rawData.map((x: tmpUserResult) => ({
      title: x.displayName,
      status: 'active',
      id: x.id,
      upn: x.userPrincipalName,
      firstName: x.givenName,
      lastName: x.surname,
      jobTitle: x.jobTitle,
      department: { id: `id-${x.department}`, title: x.department, createdTimestamp: new Date().getTime(), active: true },
      managers: [],
      active: true,
      createdTimestamp: new Date().getTime(),
      image: x.image,
      availability: x.availability,
      activity: x.activity
   })) as IUserModel[];
}

const transformBasicUsersResult = (rawData: IGraphUserResult[]): IUserModel[] => {
   return rawData.map((x: IGraphUserResult) => ({
      title: x.displayName,
      status: 'active',
      id: x.id,
      upn: x.userPrincipalName,
      firstName: x.givenName,
      lastName: x.surname,
      jobTitle: x.jobTitle,
      department: { id: `id-${x.department}`, title: x.department, createdTimestamp: new Date().getTime(), active: true },
      managers: [],
      active: true,
      createdTimestamp: new Date().getTime(),
   }));
}

export const graphApiService = baseGraphApi.injectEndpoints({
   endpoints: (build) => ({
      searchUsers: build.query<IUserModel[], string>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               const selectedFields = `department,jobTitle,id,userPrincipalName,displayName,surname,givenName`;
               const searchQuery = `"displayName:${_arg}" OR "mail:${_arg}"`;
               const searchPath = `/users?$search=${searchQuery}&$select=${selectedFields}`;
               let searchResult = await graph.api(searchPath).header("ConsistencyLevel", "eventual").get();
               let usersResult = await getBatchUserPresenceAndPhotos(searchResult.value as IGraphUserResult[], graph);
               const result = transformUserBatchResult(usersResult);
               return result
                  ? { data: result.sort((x: any) => x.title) }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
      getBatchUserPresenceAndPhotos: build.query<any[], any[]>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               let searchResult = await graph.api('/users?$search="displayName:' + _arg + '"').header("ConsistencyLevel", "eventual").get();
               //let usersResult = await GraphClient.getBatchUsersPhotoAndPresence(searchResult.value);

               return searchResult
                  ? { data: searchResult.sort((x: any) => x.displayName) }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
      getUser: build.query<IUserModel, string>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               let searchResult = await graph.api(`/users/${_arg}?$select=department,jobTitle,id,userPrincipalName,displayName,surname,givenName`).get();

               //let usersResult = await GraphClient.getBatchUsersPhotoAndPresence(searchResult.value);

               return searchResult
                  ? { data: transformBasicUsersResult([searchResult])[0] }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
      getUserManagers: build.query<IUserModel[], string>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               let result: IGraphUserResult[] = [];
               let searchManager1Result = await graph.api(`/users/${_arg}/manager`).get() as IGraphUserResult;
               if (searchManager1Result) {
                  result.push(searchManager1Result);
                  let searchManager2Result = await graph.api(`/users/${searchManager1Result.id}/manager`).get() as IGraphUserResult;
                  if (searchManager2Result) {
                     result.push(searchManager2Result);
                  }
               }
               //let usersResult = await GraphClient.getBatchUsersPhotoAndPresence(searchResult.value);

               return result
                  ? { data: transformBasicUsersResult(result) }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
      getUserWithPhotoAndPresence: build.query<IUserModel, string>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               let searchResult = await graph.api(`/users/${_arg}?$select=department,jobTitle,id,userPrincipalName,displayName,surname,givenName`).get();
               let photoResult = await graph.api(`/users/${_arg}/photos/48x48/$value`).header("Content-Type", "image/jpg").get();
               let imgURL = URL.createObjectURL(photoResult);
               return searchResult
                  ? {
                     data: transformUserBatchResult([{
                        ...searchResult,
                        image: imgURL
                     }])[0]
                  }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
      getMultipleUsersWithPhotoAndPresence: build.query<IUserModel[], string[]>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            try {
               const result: IUserModel[] = [];
               const graph = _graph as Client;
               if (!graph)
                  throw new Error("No graph client defined");
               for await (const userUPN of _arg) {
                  let searchResult = await graph.api(`/users/${userUPN.trim()}?$select=department,jobTitle,id,userPrincipalName,displayName,surname,givenName`).get();
                  let photoResult = await graph.api(`/users/${userUPN.trim()}/photos/48x48/$value`).header("Content-Type", "image/jpg").get();
                  let imgURL = URL.createObjectURL(photoResult);
                  result.push(transformUserBatchResult([{
                     ...searchResult,
                     image: imgURL
                  }])[0])
               };
               return result
                  ? {
                     data: result
                  }
                  : defaultErrors.rtkApi.GRAPH.SEARCH_USERS
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
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: graphApiEndpoints,
   useSearchUsersQuery,
   useGetBatchUserPresenceAndPhotosQuery,
   useGetUserQuery,
   useLazyGetUserQuery,
   useGetUserManagersQuery,
   useGetUserWithPhotoAndPresenceQuery,
   useLazyGetUserWithPhotoAndPresenceQuery,
   useLazyGetMultipleUsersWithPhotoAndPresenceQuery,
} = graphApiService
