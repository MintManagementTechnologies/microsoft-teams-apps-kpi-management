import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, Divider, Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import {
    selectGoalBatch, selectGoalBatchFormState, selectGoalBatchSearchQuery, selectGoalBatchTriggerApi
} from './goalBatchSelectors';
import {
    useCreateGoalBatchMutation, useGetGoalBatchQuery, useLazyGetGoalBatchQuery
} from './goalBatchService';
import {
    formStateChanged, itemAdded, itemChanged, itemDeleted, itemUpdated, sliceChanged
} from './goalBatchSlice';
import NewGoalBatch from './parts/forms/NewGoalBatch';
import { IGoalBatchModel, IGoalBatchSearchModel, newGoalBatch } from './types';

const GoalBatch = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | 'isValid' | '',
   id?: number,
   item?: IGoalBatchModel,
   as?: 'TableRow' | 'hidden'
}): JSX.Element => {
   const { id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newGoalBatch);

   const selectedItem = useSelector(selectGoalBatch);
   const selectedFormState = useSelector(selectGoalBatchFormState);
   const selectedTriggerApi = useSelector(selectGoalBatchTriggerApi);
   const selectedSearchQuery = useSelector(selectGoalBatchSearchQuery) as IGoalBatchSearchModel;

   const [triggerGetGoalBatchQuery,
      { data: dataGetGoalBatch, isFetching: isFetchingGetGoalBatch, isLoading: isLoadingGetGoalBatch }]
      = useLazyGetGoalBatchQuery();

   // On Appraisal Period changed
   useEffect(() => {
      if (!selectedSearchQuery) return;
      console.log(`GoalBatch Search ----`);
      console.log(`UserId: ${selectedSearchQuery.userId}; periodId: ${selectedSearchQuery.appraisalPeriodId}`);
      console.log(`---- GoalBatch Search ----`);
      if (!selectedSearchQuery || !selectedSearchQuery.userId || !selectedSearchQuery.appraisalPeriodId) return;
      triggerGetGoalBatchQuery(selectedSearchQuery);
      setItemState(newGoalBatch);
      dispatch(sliceChanged({ item: null, formState: 'view' }));
   }, [selectedSearchQuery]);

   // Init Item
   useEffect(() => {
      if (!dataGetGoalBatch) return;
      setItemState(dataGetGoalBatch);
      dispatch(itemChanged(dataGetGoalBatch));
   }, [dataGetGoalBatch]);

   // Change Item DisplayMode
   useEffect(() => {
      if (selectedFormState === displayModeState) return;
      if (itemState && selectedItem && selectedItem.id !== itemState.id) {
         setDisplayModeState('view');
      }
      else {
         setDisplayModeState(selectedFormState === '' ? 'view' : selectedFormState);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedItem, selectedFormState]);

   // Trigger Api
   useEffect(() => {
      if (!selectedTriggerApi || selectedFormState === 'view') return;
      if (selectedFormState === 'delete') {
         dispatch(itemDeleted(selectedItem));
      }
      else if (selectedFormState === 'new') {
         dispatch(itemAdded(selectedItem));
         setItemState(selectedItem);
      }
      else if (selectedFormState === 'edit') {
         // dispatch(itemUpdated(selectedItem));
         setItemState(selectedItem);
      }
      dispatch(sliceChanged({ formState: '', triggerApi: false }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);


   // Init new Item
   useEffect(() => {
      if (itemState && itemState.id > 0) return;
      if(!dataGetGoalBatch || dataGetGoalBatch.id > 0) return;
      if(isLoadingGetGoalBatch || isFetchingGetGoalBatch) return;
      dispatch(formStateChanged('new'));
   }, [itemState, isLoadingGetGoalBatch, isFetchingGetGoalBatch]);
   const isLoading = isLoadingGetGoalBatch || isFetchingGetGoalBatch;

   //TODO error Checking
   // const isError = errorMessage.length > 0;
   // if (isError) {
   //    return (
   //       <Flex padding={'padding.medium'} fill column>
   //          <br />
   //          <ErrorMessage message={errorMessage} messageDetails={`TODO-error-messageDetails`}>
   //             {/* <Text content={errorMessage} /> */}
   //          </ErrorMessage>
   //       </Flex>
   //    )
   // }

   if(as === 'hidden') {
      return (<></>)
   }

   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new' && selectedSearchQuery && selectedSearchQuery.appraisalPeriodId > 0;
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading && <Loader message={t('entity.goalBatch', { count: 0 })} />}
         {!isLoading && isNewMode && <NewGoalBatch appraisalPeriodId={selectedSearchQuery.appraisalPeriodId} />}
         {/* {!isLoading && isViewMode && <ViewGoalBatch appraisalPeriodId={selectedSearchQuery.appraisalPeriodId} />} TODO*/}
      </>
   );
}

export default GoalBatch;