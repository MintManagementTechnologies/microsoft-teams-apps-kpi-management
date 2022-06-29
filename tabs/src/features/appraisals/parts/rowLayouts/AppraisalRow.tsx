import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import { useAppDispatch } from '../../../../store';
import {
    selectAppraisal, selectAppraisalFormState, selectAppraisalTriggerApi
} from '../../appraisalSelectors';
import { useGetGoalForAppraisalQuery } from '../../appraisalService';
import {
    IAppraisalListItemModel, IAppraisalModel, IAppraisalSearchModel, newAppraisal
} from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const AppraisalRow = (props: {
   searchModel?: IAppraisalSearchModel,
   item?: IAppraisalListItemModel,
}): JSX.Element => {
   const { searchModel, item } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState('view');
   const [itemState, setItemState] = useState(item);

   const selectedItem = useSelector(selectAppraisal);
   const selectedFormState = useSelector(selectAppraisalFormState);
   const selectedTriggerApi = useSelector(selectAppraisalTriggerApi);

   // const { data: dataGetAppraisal, isFetching: isFetchingGetAppraisal, isLoading: isLoadingGetAppraisal }
   //    = useGetGoalForAppraisalQuery(searchModel || skipToken);

   // // Init Item
   // useEffect(() => {
   //    if (!dataGetAppraisal) return;
   //    setItemState(dataGetAppraisal);
   // }, [dataGetAppraisal]);

   // Change Item DisplayMode
   useEffect(() => {
      if (!itemState) return;
      // if (selectedItem.batchId !== itemState.appraisalTitleId) {
      //    setDisplayModeState('view');
      // }
      else {
         setDisplayModeState(selectedFormState === '' ? 'view' : selectedFormState);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedItem, selectedFormState]);

   // Trigger Api
   // useEffect(() => {
   //    if (selectedItem.id !== itemState.id) return;
   //    if (!selectedTriggerApi || selectedFormState === 'view') return;
   //    if (selectedFormState === 'delete') {
   //       dispatch(itemDeleted(selectedItem));
   //    }
   //    else if (selectedFormState === 'new') {
   //       dispatch(itemAdded(selectedItem));
   //    }
   //    else if (selectedFormState === 'edit') {
   //       dispatch(itemUpdated(selectedItem));
   //       setItemState(selectedItem);
   //    }
   //    dispatch(sliceChanged({ item: newAppraisal, formState: '', triggerApi: false }));
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [selectedTriggerApi, selectedFormState]);

   //const isLoading = isLoadingGetAppraisal || isFetchingGetAppraisal;

   //TODO error Checking
   const isError = !itemState || displayModeState === 'delete';
   if (isError) {
      return (
         <ErrorMessage message={`TODO-error-message`} messageDetails={`TODO-error-messageDetails`}>
            <Text content={`TODO-error-children`} />
         </ErrorMessage>
      )
   }

   return (
      <>
         <Row className="mmt-row-appraisal">
            <Col
               className={`mmt-col-appraisal mmt-appraisal-description`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Text content={`${itemState.name}`} />
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-weight`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Text content={`${itemState.approvalStatus}`} />
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-weight`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Text content={`${itemState.selfReviewAverage}%`} />
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-weight`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Text content={`${itemState.managerReviewAverage}%`} />
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-weight`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Text content={`${itemState.created}`} />
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-actions`}
               xl={2} lg={2} md={2} sm={2}
            >
               {/* <ItemActionsPopup actions={['edit']} item={itemState} /> */}
            </Col>
         </Row>
      </>
   );
}

export default AppraisalRow;