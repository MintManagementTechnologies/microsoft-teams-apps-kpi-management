import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { useAppDispatch } from '../../store';
import {
    selectAppraisalPeriod, selectAppraisalPeriodFormState, selectAppraisalPeriodTriggerApi
} from './appraisalPeriodSelectors';
import {
    useCreateAppraisalPeriodMutation, useGetAppraisalPeriodQuery, useUpdateAppraisalPeriodMutation
} from './appraisalPeriodService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from './appraisalPeriodSlice';
import EditAppraisalPeriod from './parts/forms/EditAppraisalPeriod';
import ViewAppraisalPeriod from './parts/forms/ViewAppraisalPeriod';
import { IAppraisalPeriodModel, newAppraisalPeriod } from './types';

const AppraisalPeriod = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   id?: number,
   item?: IAppraisalPeriodModel,
   as?: 'TableRow'
}): JSX.Element => {
   const { id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newAppraisalPeriod);
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });

   const selectedItem = useSelector(selectAppraisalPeriod);
   const selectedFormState = useSelector(selectAppraisalPeriodFormState);
   const selectedTriggerApi = useSelector(selectAppraisalPeriodTriggerApi);

   const { data: dataGetAppraisalPeriod, isFetching: isFetchingGetAppraisalPeriod, isLoading: isLoadingGetAppraisalPeriod }
      = useGetAppraisalPeriodQuery(id || skipToken);
   const [createAppraisalPeriod,
      { isLoading: isLoadingCreateAppraisalPeriod, isError: isErrorCreateAppraisalPeriod, error: errorCreateAppraisalPeriod }]
      = useCreateAppraisalPeriodMutation();
   const [updateAppraisalPeriod,
      { isLoading: isLoadingUpdateAppraisalPeriod, isError: isErrorUpdateAppraisalPeriod, error: errorUpdateAppraisalPeriod }]
      = useUpdateAppraisalPeriodMutation();

   // Init Item
   useEffect(() => {
      if (!dataGetAppraisalPeriod) return;
      setItemState(dataGetAppraisalPeriod);
   }, [dataGetAppraisalPeriod]);

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
         createAppraisalPeriod(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemAdded(selectedItem));
      }
      else if (selectedFormState === 'edit') {
         updateAppraisalPeriod(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemUpdated(selectedItem));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   // Update Error Message
   useEffect(() => {
      if (!isErrorCreateAppraisalPeriod) return;
      const tmpAction = displayModeState === 'new' ? 'create' : 'update';
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.${tmpAction}`),
            entity: t('entity.appraisalPeriod', { count: 1 })
         }),
         details: JSON.stringify(errorCreateAppraisalPeriod)
      });
   }, [isErrorCreateAppraisalPeriod]);

   const handleOnApiResponse = (result: any) => {
      if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
         dispatch(sliceChanged({ item: newAppraisalPeriod, formState: 'closeForm', triggerApi: false }));
      } else if (result.status.toLowerCase() === 'failed') {
         const apiAction = selectedFormState === 'new' ? 'create' : selectedFormState;
         setItemState(selectedItem);
         setError({
            show: true,
            message: t('common:error.entityAction', {
               action: t(`common:button.${apiAction}`),
               entity: t('entity.appraisalPeriod', { count: 1 })
            }),
            details: result.message
         });
      } else {
         debugger;
      }
   }

   const handleOnErrorDismiss = () => {
      setError({
         show: false,
         message: '',
         details: ''
      });
      dispatch(sliceChanged({ triggerApi: false }));
   }

   const isError = error.show || !itemState || displayModeState === 'delete';
   if (isError) {
      return (
         <ErrorMessage message={error.message} messageDetails={error.details}
            onDismiss={handleOnErrorDismiss}
         />
      )
   }

   const isLoading = isLoadingGetAppraisalPeriod || isFetchingGetAppraisalPeriod || isLoadingCreateAppraisalPeriod;
   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new';
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading ? <Loader message={t('entity.appraisalPeriod', { count: 1 })} />
            : <>
               {(isEditMode || isNewMode) && <EditAppraisalPeriod item={itemState} displayMode={displayModeState} />}
               {isViewMode && <ViewAppraisalPeriod item={itemState} />}
            </>
         }
      </>
   );
}

export default AppraisalPeriod;