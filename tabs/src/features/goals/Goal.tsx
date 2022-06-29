import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { useAppDispatch } from '../../store';
import { selectGoal, selectGoalFormState, selectGoalTriggerApi } from './goalSelectors';
import {
    useCreateGoalMutation, useDeleteGoalMutation, useGetGoalQuery, useUpdateGoalMutation
} from './goalService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from './goalSlice';
import EditGoal from './parts/forms/EditGoal';
import ViewGoal from './parts/forms/ViewGoal';
import { IGoalModel, newGoal } from './types';

const Goal = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   id?: number,
   item?: IGoalModel,
   as?: 'TableRow'
}): JSX.Element => {
   const { id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newGoal);
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });


   const selectedItem = useSelector(selectGoal);
   const selectedFormState = useSelector(selectGoalFormState);
   const selectedTriggerApi = useSelector(selectGoalTriggerApi);

   const { data: dataGetGoal, isFetching: isFetchingGetGoal, isLoading: isLoadingGetGoal }
      = useGetGoalQuery(id || skipToken);
   const [createGoal, { isLoading: isLoadingCreateGoal, isError: isErrorCreateGoal, error: errorCreateGoal }] = useCreateGoalMutation();
   const [updateGoal, { isLoading: isLoadingUpdateGoal, isError: isErrorUpdateGoal, error: errorUpdateGoal }] = useUpdateGoalMutation();
   const [deleteGoal, { isLoading: isLoadingDeleteGoal, isError: isErrorDeleteGoal, error: errorDeleteGoal }] = useDeleteGoalMutation();

   // Init Item
   useEffect(() => {
      if (!dataGetGoal) return;
      setItemState(dataGetGoal);
   }, [dataGetGoal]);

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
      setItemState(selectedItem);
      if (selectedFormState === 'delete') {
         deleteGoal(selectedItem.id).unwrap().then(handleOnApiResponse);
         // dispatch(itemDeleted(selectedItem));
      }
      else if (selectedFormState === 'new') {
         createGoal(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemAdded(selectedItem));
      }
      else if (selectedFormState === 'edit') {
         updateGoal(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemUpdated(selectedItem));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   // Update Error Message
   useEffect(() => {
      if (!(isErrorCreateGoal || isErrorUpdateGoal)) return;
      const tmpAction = displayModeState === 'new' ? 'create' : 'update';
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.${tmpAction}`),
            entity: t('entity.goal', { count: 1 })
         }),
         details: JSON.stringify(errorCreateGoal || errorUpdateGoal)
      });
   }, [isErrorCreateGoal, isErrorUpdateGoal]);

   const handleOnApiResponse = (result: any) => {
      if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
         dispatch(sliceChanged({ item: newGoal, formState: 'closeForm', triggerApi: false }));
      } else if (result.status.toLowerCase() === 'failed') {
         const apiAction = selectedFormState === 'new' ? 'create' : selectedFormState;
         setItemState(selectedItem);
         setError({
            show: true,
            message: t('common:error.entityAction', {
               action: t(`common:button.${apiAction}`),
               entity: t('entity.goal', { count: 1 })
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

   const isLoading = isLoadingGetGoal || isFetchingGetGoal || isLoadingCreateGoal || isLoadingUpdateGoal;
   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new';
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading ? <Loader message={t('entity.goal', { count: 1 })} />
            : <>
               {<EditGoal item={itemState} displayMode={displayModeState} />}
               {/* {isViewMode && <ViewGoal item={itemState} />} */}
            </>
         }
      </>
   );
}

export default Goal;