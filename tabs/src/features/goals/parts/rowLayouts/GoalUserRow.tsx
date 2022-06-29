
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Flex, FlexItem, TableCell, Text } from '@fluentui/react-northstar';

import { getStatusPillPrefix } from '../../../../common/utils/configVariables';
import StatusPill from '../../../../components/common/statusPill/StatusPill';
import {
    useGetEmployeeByIdQuery, useLazyGetEmployeeManagersQuery
} from '../../../employees/employeeService';
import ViewUser from '../../../user/ViewUser';
import { IGoalModel } from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const GoalUserRow = (props: {
   content: any,
   items: IGoalModel[],
}): JSX.Element => {
   const { content, items } = props;

   const { data: dataGetEmployeeById } = useGetEmployeeByIdQuery(items[0].userId);
   const [triggerGetEmployeeManagers, { data: dataGetEmployeeManagers }] = useLazyGetEmployeeManagersQuery();

   useEffect(() => {
      if (!dataGetEmployeeById) return;
      triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
   }, [dataGetEmployeeById]);

   const availableActions = ['viewBatch', 'groupchat', 'meeting'];
   return (
      <Row className={`mmt-row-user`}>
         <Col className={`mmt-col-user`}
            xl={2} lg={2} md={2} sm={2}
         >
            <Flex column vAlign="center">
               <ViewUser userId={dataGetEmployeeById?.upn || ''} />
            </Flex>
         </Col>
         <Col className={`mmt-col-status`}
            xl={2} lg={2} md={2} sm={2}>
            <Flex column vAlign="center">
               <StatusPill status={`pending`} content={getStatusPillPrefix(0)} />
            </Flex>
         </Col>
         <Col className={`mmt-col-goal mmt-col-priority`}
            xl={2} lg={2} md={2} sm={2}
         >
            <Flex column fill vAlign="center">
               {/* <Text content={`${item.priority}`} /> */}
            </Flex>
         </Col>
         <Col className={`mmt-col-goal mmt-col-weight`}
            xl={1} lg={1} md={1} sm={1}
         >
            <Flex column fill vAlign="center">
               {/* <Text content={`${item.weight}%`} /> */}
            </Flex>
         </Col>
         {dataGetEmployeeManagers?.map(x => (
            <Col className={`mmt-col-manager`} key={`key-manager-${x.id}`}
            xl={2} lg={2} md={2} sm={2}>
               <Flex vAlign="center">
                  <ViewUser userId={x.upn || ''} />
               </Flex>
            </Col>
         ))}
         <Col className={`mmt-col-goal mmt-goal-actions`} >
            <Flex vAlign="center" hAlign="start">
               {/* <FlexItem shrink> */}
               <ItemActionsPopup actions={availableActions} item={items[0]} />
               {/* </FlexItem> */}
            </Flex>
         </Col>
      </Row>
   );
}

export default GoalUserRow;