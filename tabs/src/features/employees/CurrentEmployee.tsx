import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { useAppDispatch } from '../../store';
import {
    selectCurrentEmployee, selectEmployeeFormState, selectEmployeeTriggerApi
} from './employeeSelectors';
import {
    useLazyGetEmployeeByIdQuery, useLazyGetEmployeeByUPNQuery, useLazyGetEmployeeManagersQuery
} from './employeeService';
import {
    currentEmployeeChanged, itemAdded, itemDeleted, itemManagersChanged, itemUpdated, sliceChanged
} from './employeeSlice';
import { IEmployeeModel, newEmployee } from './types';

const CurrentEmployee = (props: {
   upn?: string,
   id?: number,
   item?: IEmployeeModel,
   as?: 'TableRow' | 'hidden' | '',
}): JSX.Element => {
   const { upn, id, item, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item || newEmployee);

   const selectedItem = useSelector(selectCurrentEmployee);

   const [triggerGetEmployeeByUPN,
      { data: dataGetEmployeeByUPN, isFetching: isFetchingGetEmployeeByUPN, isLoading: isLoadingGetEmployeeByUPN }]
      = useLazyGetEmployeeByUPNQuery();
   const [triggerGetEmployeeById,
      { data: dataGetEmployeeById, isFetching: isFetchingGetEmployeeById, isLoading: isLoadingGetEmployeeById }]
      = useLazyGetEmployeeByIdQuery();

   const [triggerGetEmployeeManagers,
      { data: dataGetEmployeeManagers, isFetching: isFetchingGetEmployeeManagers, isLoading: isLoadingGetEmployeeManagers }]
      = useLazyGetEmployeeManagersQuery();

   useEffect(() => {
      if (id && selectedItem.id <= 0 && !upn) {
         triggerGetEmployeeById(id);
         return;
      }
      if (upn && selectedItem.upn === '' && !id) {
         triggerGetEmployeeByUPN(upn);
         return;
      }
   }, [upn, id]);

   // Init Item
   useEffect(() => {
      if (!dataGetEmployeeById && !dataGetEmployeeByUPN) return;
      setItemState((dataGetEmployeeById || dataGetEmployeeByUPN) as IEmployeeModel);
      dispatch(currentEmployeeChanged(dataGetEmployeeById || dataGetEmployeeByUPN));
      // if (dataGetEmployeeById) {
      //    triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
      // }
      // else if (dataGetEmployeeByUPN) {
      //    triggerGetEmployeeManagers(dataGetEmployeeByUPN.managers.map(x => x.id));
      // }
   }, [dataGetEmployeeById, dataGetEmployeeByUPN]);

   // useEffect(() => {
   //    if (!dataGetEmployeeManagers || dataGetEmployeeManagers.length === 0) return;
   //    const managerDetails = dataGetEmployeeManagers.map(x => ({ upn: x.upn, id: x.id }));
   //    dispatch(itemManagersChanged(managerDetails));
   // }, [dataGetEmployeeManagers]);

   const isLoading = isFetchingGetEmployeeByUPN || isLoadingGetEmployeeByUPN || isFetchingGetEmployeeById || isLoadingGetEmployeeById;
   if (as === 'hidden') {
      return (<></>)
   }

   return (
      <>
         {isLoading ? <Loader message={t('entity.employee', { count: 1 })} />
            : <>
               <Text content={itemState.title} />
            </>
         }
      </>
   );
}

export default CurrentEmployee;