import { baseApi } from '../../services';
// import { meMockData, myManagersMockData } from './mockData';
import { IEmployeeAPIModel, IEmployeeModel } from './types';

export const employeeService = baseApi.injectEndpoints({
   endpoints: (build) => ({
      getEmployeeByUPN: build.query<IEmployeeModel, string>({
         // query: (upn) => `/Employee?email=olalekan.wahab@heirsholdings.com`,
         query: (upn) => `/Employee?email=${upn}`,
         transformResponse: (rawResult: IEmployeeAPIModel, meta) => {
            // if(!rawResult.employee){
            // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            // console.error('employeeService -> getEmployeeById');
            // console.log('using mockData...');
            // return meMockData;
            // }
            // bug - Why am I sending this?
            const managers: { order: number, id: number, upn: string, title: string }[] = [];
            if (rawResult.employee.line1fk && rawResult.employee.line1fk !== null && rawResult.employee.line1fk > 0) {
               const manager = {
                  order: 0,
                  id: rawResult.employee.line1fk,
                  upn: "",
                  title: rawResult.employee.line1
               }
               managers.push(manager);
            }

            if (rawResult.employee.line2fk && rawResult.employee.line2fk !== null && parseInt(rawResult.employee.line2fk)) {
               const manager = {
                  order: 1,
                  id: parseInt(rawResult.employee.line2fk),
                  upn: "",
                  title: rawResult.employee.line2
               }
               managers.push(manager);
            }

            const transformedResult: IEmployeeModel = {
               companyId: rawResult.employee.cnamefk,
               jobTitleId: rawResult.employee.jobtitlefk,
               departmentId: rawResult.employee.deptfk,
               managers: managers,
               id: rawResult.employee.id,
               upn: rawResult.employee.email,
               title: `${rawResult.employee.firstName} ${rawResult.employee.lastName}`,
               jobTitle: rawResult.employee.jobTitle,
               department: rawResult.employee.department
            }
            return transformedResult;
         },
      }),
      getEmployeeById: build.query<IEmployeeModel, number>({
         // async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
         //    return { data: meMockData };
         // },
         query: (id) => `/Employee/employeeDetails/${id}`,
         transformResponse: (rawResult: IEmployeeAPIModel, meta) => {
            // if(!rawResult.employee){
            // console.error(`NO ITEMS FROM API - ${meta?.request.url.substring(34)}`);
            // console.error('employeeService -> getEmployeeById');
            // console.log('using mockData...');
            // return meMockData;
            // }
            const managers: { order: number, id: number, upn: string, title: string }[] = [];
            if (rawResult.employee.line1fk && rawResult.employee.line1fk !== null && rawResult.employee.line1fk > 0) {
               const manager = {
                  order: 0,
                  id: rawResult.employee.line1fk,
                  upn: "",
                  title: rawResult.employee.line1
               }
               managers.push(manager);
            }

            if (rawResult.employee.line2fk && rawResult.employee.line2fk !== null && parseInt(rawResult.employee.line2fk) > 0) {
               const manager = {
                  order: 1,
                  id: parseInt(rawResult.employee.line2fk),
                  upn: "",
                  title: rawResult.employee.line2
               }
               managers.push(manager);
            }

            const transformedResult: IEmployeeModel = {
               companyId: rawResult.employee.cnamefk,
               jobTitleId: rawResult.employee.jobtitlefk,
               departmentId: rawResult.employee.deptfk,
               managers: managers,
               id: rawResult.employee.id,
               upn: rawResult.employee.email,
               title: `${rawResult.employee.firstName} ${rawResult.employee.lastName}`,
               jobTitle: rawResult.employee.jobTitle,
               department: rawResult.employee.department
            }
            return transformedResult;
         },
      }),
      getEmployeeManagers: build.query<IEmployeeModel[], number[]>({
         async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
            let result: IEmployeeModel[] = [];
            try {
               for await (const employeeId of _arg) {
                  const rawResultResponse = await baseQuery({
                     url: `/Employee/employeeDetails/${employeeId}`,
                     method: 'GET'
                  });
                  const rawResult = rawResultResponse.data as IEmployeeAPIModel;
                  const transformedResult: IEmployeeModel = {
                     companyId: rawResult.employee.cnamefk,
                     jobTitleId: rawResult.employee.jobtitlefk,
                     departmentId: rawResult.employee.deptfk,
                     managers: [],
                     id: rawResult.employee.id,
                     upn: rawResult.employee.email,
                     title: `${rawResult.employee.firstName} ${rawResult.employee.lastName}`,
                     jobTitle: rawResult.employee.jobTitle,
                     department: rawResult.employee.department
                  }
                  result.push(transformedResult)
               }

               return result
                  ? { data: result }
                  : {
                     error: {
                        status: 'FETCH_ERROR',
                        error: 'getEmployeeManagers'
                     }
                  } as any
            } catch (error: any) {
               return {
                  error: {
                     status: 100,
                     error: `error.message`
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
   endpoints: employeeEndpoints,
   useGetEmployeeByUPNQuery,
   useLazyGetEmployeeByUPNQuery,
   useGetEmployeeByIdQuery,
   useLazyGetEmployeeByIdQuery,
   useGetEmployeeManagersQuery,
   useLazyGetEmployeeManagersQuery,
} = employeeService
