import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Flex, Text } from '@fluentui/react-northstar';

import { RootState, useTypedSelector } from '../../../../store';
import { IGoalModel } from '../../types';
import ItemActionsPopup from '../buttons/ItemActionsPopup';

const GoalRow = (props: { item: IGoalModel, displayMode: string }): JSX.Element => {
   const { item, displayMode } = props;

   const [displayModeState, setDisplayModeState] = useState('view');

   // Change Item DisplayMode
   // useEffect(() => {
   //    setDisplayModeState(displayMode === '' ? 'view' : displayMode);
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [displayMode]);

   const availableActions = displayMode === 'view' ? ['view'] : ['view', 'edit', 'delete'];
   return (
      <>
         <Row className="mmt-row-goal mmt-list-row mmt-list-sub-row">
            <Col className={`mmt-col-goal mmt-col-description`}
               xl={4} lg={4} md={4} sm={2}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${item.description}`} />
               </Flex>
            </Col>
            <Col className={`mmt-col-goal mmt-col-priority`}
               xl={2} lg={2} md={2} sm={2}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${item.priority}`} />
               </Flex>
            </Col>
            <Col className={`mmt-col-goal mmt-col-weight`}
               xl={1} lg={1} md={1} sm={1}
            >
               <Flex column fill vAlign="center">
                  <Text content={`${item.weight}%`} />
               </Flex>
            </Col>
            <Col className={`mmt-col-manager`} >
               <Flex vAlign="center">
                  {/* <ViewUser userId={x.upn || ''} /> */}
               </Flex>
            </Col>
            <Col className={`mmt-col-manager`} >
               <Flex vAlign="center">
                  {/* <ViewUser userId={x.upn || ''} /> */}
               </Flex>
            </Col>
            <Col className={`mmt-col-goal mmt-col-actions`}
            >
               <Flex vAlign="center">
                  <ItemActionsPopup actions={availableActions} item={item} />
               </Flex>
            </Col>
         </Row>
      </>
   );
}

export default GoalRow;