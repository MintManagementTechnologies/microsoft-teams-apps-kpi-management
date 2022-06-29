import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { IBaseApiResponse } from '../../services';
import { useAppDispatch } from '../../store';
import {
    useCreateKeyResultAreaMutation, useDeleteKeyResultAreaMutation, useGetKeyResultAreaQuery,
    useUpdateKeyResultAreaMutation
} from './keyResultAreaService';
import {
    itemAdded, itemDeleted, itemUpdated, selectKeyResultArea, selectKeyResultAreaFormState,
    selectKeyResultAreaTriggerApi, sliceChanged
} from './keyResultAreaSlice';
import EditKeyResultArea from './parts/EditKeyResultArea';
import ViewKeyResultArea from './parts/ViewKeyResultArea';
import { IKeyResultAreaModel, newKeyResultArea } from './types';

const KeyResultArea = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   id?: number,
   item?: IKeyResultAreaModel,
   as?: 'TableRow'
}): JSX.Element => {
   const { id, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newKeyResultArea);
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });

   const selectedItem = useSelector(selectKeyResultArea);
   const selectedFormState = useSelector(selectKeyResultAreaFormState);
   const selectedTriggerApi = useSelector(selectKeyResultAreaTriggerApi);

   const { data: dataGetKeyResultArea, isFetching: isFetchingGetKeyResultArea, isLoading: isLoadingGetKeyResultArea }
      = useGetKeyResultAreaQuery(id || skipToken);
   const [createKeyResultArea, { isLoading: isLoadingCreateKeyResultArea, isError: isErrorCreateKeyResultArea, error: errorCreateKeyResultArea }] = useCreateKeyResultAreaMutation();
   const [updateKeyResultArea, { isLoading: isLoadingUpdateKeyResultArea, isError: isErrorUpdateKeyResultArea, error: errorUpdateKeyResultArea }] = useUpdateKeyResultAreaMutation();
   const [deleteKeyResultArea, { isLoading: isLoadingDeleteKeyResultArea, isError: isErrorDeleteKeyResultArea, error: errorDeleteKeyResultArea }] = useDeleteKeyResultAreaMutation();

   // Init Item
   useEffect(() => {
      if (!dataGetKeyResultArea) return;
      setItemState(dataGetKeyResultArea);
   }, [dataGetKeyResultArea]);

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
         deleteKeyResultArea(selectedItem.id).unwrap().then(handleOnApiResponse);
         // dispatch(itemDeleted(selectedItem));
      }
      else if (selectedFormState === 'new') {
         // dispatch(itemAdded(selectedItem));
         createKeyResultArea(selectedItem).unwrap().then(handleOnApiResponse);
      }
      else if (selectedFormState === 'edit') {
         updateKeyResultArea(selectedItem).unwrap().then(handleOnApiResponse);
         // dispatch(itemUpdated(selectedItem));
         setItemState(selectedItem);
      }
      // dispatch(sliceChanged({ item: newKeyResultArea, formState: '', triggerApi: false }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   const handleOnApiResponse = (result: IBaseApiResponse) => {
      if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
         if (selectedFormState === 'delete') {
            dispatch(itemDeleted(selectedItem));
         }
         else if (selectedFormState === 'new') {
            dispatch(itemAdded(result.data));
         }
         else if (selectedFormState === 'edit') {
            dispatch(itemUpdated(selectedItem));
         }
         dispatch(sliceChanged({ item: newKeyResultArea, formState: '', triggerApi: false }));
      } else if (result.status.toLowerCase() === 'failed') {
         const apiAction = selectedFormState === 'new' ? 'create' : selectedFormState;
         setItemState(selectedItem);
         setError({
            show: true,
            message: t('common:error.entityAction', {
               action: t(`common:button.${apiAction}`),
               entity: t('entity.kra', { count: 1 })
            }),
            details: result.message
         });
      } else {
         debugger;
      }
   }

   const isLoading = isLoadingGetKeyResultArea || isFetchingGetKeyResultArea;

   //TODO error Checking
   const isError = !itemState || displayModeState === 'delete';
   if (isError) {
      return (
         <ErrorMessage message={`TODO-error-message`} messageDetails={`TODO-error-messageDetails`}>
            <Text content={`TODO-error-children`} />
         </ErrorMessage>
      )
   }

   const isViewMode = displayModeState === 'view';
   const isNewMode = displayModeState === 'new';
   const isEditMode = displayModeState === 'edit';
   return (
      <>
         {isLoading ? <Loader message={t('entity.kra', { count: 1 })} />
            : <Row className="mmt-row-kra" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-kra`} className={`mmt-col-kra`}>
                  {(isEditMode || isNewMode) && <EditKeyResultArea item={itemState} />}
                  {isViewMode && <ViewKeyResultArea item={itemState} />}
               </Col>
            </Row>
         }
      </>
   );
}

export default KeyResultArea;