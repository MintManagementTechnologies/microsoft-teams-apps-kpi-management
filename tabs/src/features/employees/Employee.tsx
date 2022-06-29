import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text } from '@fluentui/react-northstar';
import { useData } from '@microsoft/teamsfx-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { useAppDispatch } from '../../store';
import {
    selectEmployee, selectEmployeeFormState, selectEmployeeTriggerApi
} from './employeeSelectors';
import { useLazyGetEmployeeByIdQuery, useLazyGetEmployeeByUPNQuery } from './employeeService';
import { itemAdded, itemChanged, itemDeleted, itemUpdated, sliceChanged } from './employeeSlice';
import mockData from './mockData';
import { IEmployeeModel, newEmployee } from './types';

const Employee = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   upn?: string,
   id?: number,
   item?: IEmployeeModel,
   as?: 'TableRow' | 'hidden' | '',
}): JSX.Element => {
   const { upn, id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newEmployee);

   const selectedItem = useSelector(selectEmployee);
   const selectedFormState = useSelector(selectEmployeeFormState);
   const selectedTriggerApi = useSelector(selectEmployeeTriggerApi);

   const [triggerGetEmployeeByUPN,
      { data: dataGetEmployeeByUPN, isFetching: isFetchingGetEmployeeByUPN, isLoading: isLoadingGetEmployeeByUPN }]
      = useLazyGetEmployeeByUPNQuery();
   const [triggerGetEmployeeById,
      { data: dataGetEmployeeById, isFetching: isFetchingGetEmployeeById, isLoading: isLoadingGetEmployeeById }]
      = useLazyGetEmployeeByIdQuery();

   useEffect(() => {
      if (id && selectedItem.id === 0 && !upn){
         triggerGetEmployeeById(id);
         return;
      }
      if (upn && selectedItem.upn === '' && !id){
         triggerGetEmployeeByUPN(upn);
         return;
      }
   }, []);

   // Init Item
   useEffect(() => {
      if (!dataGetEmployeeById && !dataGetEmployeeByUPN) return;
      setItemState((dataGetEmployeeById || dataGetEmployeeByUPN) as IEmployeeModel);
      dispatch(itemChanged(dataGetEmployeeById || dataGetEmployeeByUPN));
   }, [dataGetEmployeeById, dataGetEmployeeByUPN]);

   // Change Item DisplayMode
   useEffect(() => {
      if (!itemState) return;
      if (selectedItem.id !== itemState.id) {
         setDisplayModeState('view');
      }
      else {
         setDisplayModeState(selectedFormState === '' ? 'view' : selectedFormState);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedItem, selectedFormState]);

   // Trigger Api
   useEffect(() => {
      if (selectedItem.id !== itemState.id) return;
      if (!selectedTriggerApi || selectedFormState === 'view') return;
      if (selectedFormState === 'delete') {
         dispatch(itemDeleted(selectedItem));
      }
      else if (selectedFormState === 'new') {
         dispatch(itemAdded(selectedItem));
      }
      else if (selectedFormState === 'edit') {
         dispatch(itemUpdated(selectedItem));
         setItemState(selectedItem);
      }
      dispatch(sliceChanged({ item: newEmployee, formState: '', triggerApi: false }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   const isLoading = isFetchingGetEmployeeByUPN || isLoadingGetEmployeeByUPN || isFetchingGetEmployeeById || isLoadingGetEmployeeById;

   //TODO error Checking
   const isError = !itemState || displayModeState === 'delete';
   if (isError) {
      return (
         <ErrorMessage message={`TODO-error-message`} messageDetails={`TODO-error-messageDetails`}>
            <Text content={`TODO-error-children`} />
         </ErrorMessage>
      )
   }

   if (as === 'hidden') {
      return (<></>)
   }

   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new';
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading ? <Loader message={t('entity.appraisalPeriod', { count: 1 })} />
            : <>
               <Text content={itemState.title} />
            </>
         }
      </>
   );
}

export default Employee;