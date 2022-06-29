import mockUsers from '../../common/mockData/mockUsers';
import { IUserModel } from '../../common/types/user';
import { defaultErrors } from '../../common/utils/commonVariables';
import { log } from '../../common/utils/customConsoleLog';
import { sortBy } from '../../common/utils/sharedFunctions';
import { baseApi } from '../../services';

export const userService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      createUser: build.mutation<IUserModel, Partial<IUserModel>>({
         query(body) {
            debugger;
            return {
               url: `users/createUser`,
               method: 'POST',
               body,
            };
         }
      }),
      getUser: build.query<IUserModel, string>({
         //query: (id) => `users/getUser/${id}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockUsers.find(x => x.upn === userUPN || x.id === userUPN);
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
      getAllUsers: build.query<IUserModel[], void>({
         //query: (userUPN) => `users/getAllUsers/${userUPN}`,
         async queryFn(_void, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockUsers.map(x => ({
                  title: x.title,
                  id: x.id,
                  upn: x.upn,
                  firstName: x.firstName,
                  lastName: x.lastName,
                  jobTitle: x.jobTitle,
                  active: x.active,
                  createdTimestamp: x.createdTimestamp,
                  status: x.status,
                  departmentTitle: x.department.title,
                  managers: x.managers
               }));
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
      getAllMyUsers: build.query<IUserModel[], string>({
         //query: (userUPN) => `users/getAllUsers/${userUPN}`,
         async queryFn(userUPN, _queryApi, _extraOptions, baseQuery) {
            try {
               let result = mockUsers.filter(u => u.managers.map(m => m.upn).includes(userUPN));
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
      updateUser: build.mutation<IUserModel, Partial<IUserModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `users/updateUser/${id}`,
               method: 'PATCH',
               body: item
            };
         },
         async onQueryStarted(item: Partial<IUserModel>, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               userService.util.updateQueryData('getAllUsers', undefined, draftItems => {
                  const draftIndex = draftItems.findIndex((x: IUserModel) => x.id === item.id);
                  if (draftIndex > 0) {
                     draftItems[draftIndex] = { ...item } as IUserModel;
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
      deleteUser: build.mutation<boolean, Partial<IUserModel>>({
         query(item) {
            const { id } = item;
            return {
               url: `users/deleteUser/${id}`,
               method: 'DELETE'
            };
         },
         async onQueryStarted(item: IUserModel, { dispatch, queryFulfilled }) {
            // `updateQueryData` requires the endpoint name and cache key arguments,
            // so it knows which piece of cache state to update
            const patchResult = dispatch(
               userService.util.updateQueryData('getAllUsers', undefined, draftItems => {
                  // The `draftItems` is Immer-wrapped and can be "mutated" like in createSlice
                  const draftIndex = draftItems.findIndex((x: IUserModel) => x.id === item.id);
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
   endpoints: userEndpoints,
   useCreateUserMutation,
   useGetUserQuery,
   useGetAllUsersQuery,
   useGetAllMyUsersQuery,
   useUpdateUserMutation,
   useDeleteUserMutation,
} = userService
