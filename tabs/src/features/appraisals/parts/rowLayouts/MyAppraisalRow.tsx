import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';

import { getStatusPillPrefix } from '../../../../common/utils/configVariables';
import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import StatusPill from '../../../../components/common/statusPill/StatusPill';
import { RootState, useTypedSelector } from '../../../../store';
import {
    useGetEmployeeByIdQuery, useLazyGetEmployeeManagersQuery
} from '../../../employees/employeeService';
import ViewUser from '../../../user/ViewUser';
import { IAppraisalX } from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const MyAppraisalRow = (props: {
   item: IAppraisalX,
}): JSX.Element => {
   const { item } = props;
   const { t } = useTranslation();

   const [displayModeState, setDisplayModeState] = useState('view');
   const selectedFormState = useTypedSelector((state: RootState) => state.goal.formState);

   // const { data: dataGetEmployeeById } = useGetEmployeeByIdQuery(item.userId);
   // const [triggerGetEmployeeManagers, { data: dataGetEmployeeManagers }] = useLazyGetEmployeeManagersQuery();

   // useEffect(() => {
   //    if (!dataGetEmployeeById) return;
   //    triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
   // }, [dataGetEmployeeById]);

   // Change Item DisplayMode
   useEffect(() => {
      setDisplayModeState(selectedFormState === '' ? 'view' : selectedFormState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedFormState]);

   const availableActions = displayModeState === 'view' ? ['viewBatch', 'groupchat', 'meeting'] : ['view', 'edit', 'delete'];
   return (
      <>
         <Row className="mmt-row-appraisal">
            {/* <Col
               className={`mmt-col-appraisal mmt-col-user`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <ViewUser userId={dataGetEmployeeById?.upn || ''} />
               </Flex>
            </Col> */}
            <Col
               className={`mmt-col-appraisal mmt-col-status`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <StatusPill status={`${item.status}`} content={getStatusPillPrefix(item.currentLevel)} />
               </Flex>
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-col-review`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${item.reviews[0].outcome}%`} />
               </Flex>
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-col-review`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${item.reviews[1].outcome}%`} />
               </Flex>
            </Col>
            {/* <Col
               className={`mmt-col-appraisal mmt-col-review`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  {item.reviews.length > 2 &&
                     <Text content={`${item.reviews[2].outcome}%`} />
                  }
               </Flex>
            </Col> */}
            <Col
               className={`mmt-col-appraisal mmt-col-created`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${getLocaleDate(item.createdTimestamp)}`} />
               </Flex>
            </Col>
            <Col
               className={`mmt-col-appraisal mmt-appraisal-actions`}
            >
               <Flex column fill vAlign="center" hAlign="start">
                  <ItemActionsPopup actions={availableActions} item={item} />
               </Flex>
            </Col>
         </Row>
      </>
   );
}

export default MyAppraisalRow;