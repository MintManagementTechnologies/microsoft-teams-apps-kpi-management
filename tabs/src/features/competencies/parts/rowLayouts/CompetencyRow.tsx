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
    selectCompetency, selectCompetencyFormState, selectCompetencyTriggerApi
} from '../../competencySelectors';
import { useGetCompetencyQuery } from '../../competencyService';
import { itemAdded, itemDeleted, itemUpdated, sliceChanged } from '../../competencySlice';
import { ICompetencyModel, newCompetency } from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const CompetencyRow = (props: {
   id?: number,
   item?: ICompetencyModel,
}): JSX.Element => {
   const { id, item } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [displayModeState, setDisplayModeState] = useState('view');
   const [itemState, setItemState] = useState(item || newCompetency);

   const selectedItem = useSelector(selectCompetency);
   const selectedFormState = useSelector(selectCompetencyFormState);
   const selectedTriggerApi = useSelector(selectCompetencyTriggerApi);

   const { data: dataGetCompetency, isFetching: isFetchingGetCompetency, isLoading: isLoadingGetCompetency }
      = useGetCompetencyQuery(id || skipToken);

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
   //    dispatch(sliceChanged({ item: newCompetency, formState: '', triggerApi: false }));
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [selectedTriggerApi, selectedFormState]);

   const isLoading = isLoadingGetCompetency || isFetchingGetCompetency;

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
         {isLoading ? <Loader message={t('entity.competency', { count: 1 })} />
            : <Row className="mmt-row-competency">
               <Col
                  className={`mmt-col-competency mmt-competency-title`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  <Text content={`${itemState.title}`} />
               </Col>
               <Col
                  className={`mmt-col-competency mmt-competency-status`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  {/* <Text content={`${itemState.status}`} /> */}
               </Col>
               <Col
                  className={`mmt-col-competency mmt-competency-actions`}
                  xl={2} lg={2} md={2} sm={2}
               >
                  <ItemActionsPopup actions={['edit', 'delete']} item={itemState} />
               </Col>
            </Row>
         }
      </>
   );
}

export default CompetencyRow;