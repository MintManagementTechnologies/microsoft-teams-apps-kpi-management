import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import { useAppDispatch } from '../../../../store';
import {
    selectAppraisalPeriod, selectAppraisalPeriodFormState, selectAppraisalPeriodTriggerApi
} from '../../appraisalPeriodSelectors';
import { useGetAppraisalPeriodQuery } from '../../appraisalPeriodService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from '../../appraisalPeriodSlice';
import { IAppraisalPeriodModel, newAppraisalPeriod } from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const AppraisalPeriodRow = (props: {
   id?: number,
   item?: IAppraisalPeriodModel,
}): JSX.Element => {
   const { id, item } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState('view');
   const [itemState, setItemState] = useState(item || newAppraisalPeriod);

   const selectedItem = useSelector(selectAppraisalPeriod);
   const selectedFormState = useSelector(selectAppraisalPeriodFormState);
   const selectedTriggerApi = useSelector(selectAppraisalPeriodTriggerApi);

   const { data: dataGetAppraisalPeriod, isFetching: isFetchingGetAppraisalPeriod, isLoading: isLoadingGetAppraisalPeriod }
      = useGetAppraisalPeriodQuery(id || skipToken);

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
   //    dispatch(sliceChanged({ item: newAppraisalPeriod, formState: '', triggerApi: false }));
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [selectedTriggerApi, selectedFormState]);

   const isLoading = isLoadingGetAppraisalPeriod || isFetchingGetAppraisalPeriod;

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
         {isLoading ? <Loader message={t('entity.appraisalPeriod', { count: 1 })} />
            : <Row className="mmt-row-appraisalPeriod mmt-list-row mmt-list-sub-row">
               <Col
                  className={`mmt-col-appraisalPeriod mmt-appraisalPeriod-title`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  <Flex column fill vAlign="center">
                     <Text content={`${itemState.title}`} />
                  </Flex>
               </Col>
               <Col
                  className={`mmt-col-appraisalPeriod mmt-appraisalPeriod-status`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  <Flex column fill vAlign="center">
                     <Text content={`${t(`common:status.${itemState.active ? 'active' : 'inactive'}`)}`} color={`green`} size="large" weight="semibold" />
                     {/* <Text content={`${itemState.status}`} /> */}
                  </Flex>
               </Col>
               <Col
                  className={`mmt-col-appraisalPeriod mmt-appraisalPeriod-actions`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  <Flex fill vAlign="center">
                     <ItemActionsPopup actions={['edit', 'delete']} item={itemState} />
                  </Flex>
               </Col>
            </Row>
         }
      </>
   );
}

export default AppraisalPeriodRow;