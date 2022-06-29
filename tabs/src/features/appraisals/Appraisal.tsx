import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { useAppDispatch } from '../../store';
import {
    selectAppraisal, selectAppraisalFormState, selectAppraisalTriggerApi
} from './appraisalSelectors';
import { useGetGoalForAppraisalQuery } from './appraisalService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from './appraisalSlice';
import EditAppraisal from './parts/forms/EditAppraisal';
import ViewAppraisal from './parts/forms/ViewAppraisal';
import { IAppraisalModel, IAppraisalSearchModel, newAppraisal } from './types';

const Appraisal = (props: {
   displayMode?: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   searchModel?: IAppraisalSearchModel,
   item?: IAppraisalModel,
   as?: 'TableRow'
}): JSX.Element => {
   const { searchModel, item, displayMode, as } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState(displayMode || 'view');
   const [itemState, setItemState] = useState(item || newAppraisal);

   const selectedItem = useSelector(selectAppraisal);
   const selectedFormState = useSelector(selectAppraisalFormState);
   const selectedTriggerApi = useSelector(selectAppraisalTriggerApi);

   const { data: dataGetAppraisal, isFetching: isFetchingGetAppraisal, isLoading: isLoadingGetAppraisal }
      = useGetGoalForAppraisalQuery(searchModel || skipToken);

   // Init Item
   useEffect(() => {
      if (!dataGetAppraisal) return;
      setItemState(dataGetAppraisal);
   }, [dataGetAppraisal]);

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
         // setItemState(selectedItem);
      }
      dispatch(sliceChanged({ item: newAppraisal, formState: '', triggerApi: false }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedTriggerApi, selectedFormState]);

   const isLoading = isLoadingGetAppraisal || isFetchingGetAppraisal;

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
         {isLoading ? <Loader message={t('entity.appraisal', { count: 1 })} />
            : <>
               {(isEditMode || isNewMode) && <EditAppraisal item={itemState} />}
               {isViewMode && <ViewAppraisal item={itemState} />}
            </>
         }
      </>
   );
}

export default Appraisal;