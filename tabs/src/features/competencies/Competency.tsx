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
    selectCompetency, selectCompetencyFormState, selectCompetencyTriggerApi
} from './competencySelectors';
import {
    useCreateCompetencyMutation, useGetCompetencyQuery, useUpdateCompetencyMutation
} from './competencyService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from './competencySlice';
import EditCompetency from './parts/forms/EditCompetency';
import ViewCompetency from './parts/forms/ViewCompetency';
import { ICompetencyModel, newCompetency } from './types';

const Competency = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   id?: number,
   item?: ICompetencyModel,
   as?: 'TableRow'
}): JSX.Element => {
   const { id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newCompetency);
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });

   const selectedItem = useSelector(selectCompetency);
   const selectedFormState = useSelector(selectCompetencyFormState);
   const selectedTriggerApi = useSelector(selectCompetencyTriggerApi);

   const { data: dataGetCompetency, isFetching: isFetchingGetCompetency, isLoading: isLoadingGetCompetency }
      = useGetCompetencyQuery(id || skipToken);
   const [createCompetency,
      { isLoading: isLoadingCreateCompetency, isError: isErrorCreateCompetency, error: errorCreateCompetency }]
      = useCreateCompetencyMutation();
   const [updateCompetency,
      { isLoading: isLoadingUpdateCompetency, isError: isErrorUpdateCompetency, error: errorUpdateCompetency }]
      = useUpdateCompetencyMutation();

   // Init Item
   useEffect(() => {
      if (!dataGetCompetency) return;
      setItemState(dataGetCompetency);
   }, [dataGetCompetency]);

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
         createCompetency(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemAdded(selectedItem));
      }
      else if (selectedFormState === 'edit') {
         updateCompetency(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemUpdated(selectedItem));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   // Update Error Message
   useEffect(() => {
      if (!isErrorCreateCompetency) return;
      const tmpAction = displayModeState === 'new' ? 'create' : 'update';
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.${tmpAction}`),
            entity: t('entity.competency', { count: 1 })
         }),
         details: JSON.stringify(errorCreateCompetency)
      });
   }, [isErrorCreateCompetency]);

   const handleOnApiResponse = (result: any) => {
      if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
         dispatch(sliceChanged({ item: newCompetency, formState: 'closeForm', triggerApi: false }));
      } else if (result.status.toLowerCase() === 'failed') {
         const apiAction = selectedFormState === 'new' ? 'create' : selectedFormState;
         setItemState(selectedItem);
         setError({
            show: true,
            message: t('common:error.entityAction', {
               action: t(`common:button.${apiAction}`),
               entity: t('entity.competency', { count: 1 })
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

   const isLoading = isLoadingGetCompetency || isFetchingGetCompetency || isLoadingCreateCompetency;
   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new';
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading ? <Loader message={t('entity.competency', { count: 1 })} />
            : <>
               {(isEditMode || isNewMode) && <EditCompetency item={itemState} displayMode={displayModeState} />}
               {isViewMode && <ViewCompetency item={itemState} />}
            </>
         }
      </>
   );
}

export default Competency;