import { Col, Row } from 'react-bootstrap';

import { Flex, Text } from '@fluentui/react-northstar';

const TeamGoalsHeader = (): JSX.Element => {
   return (
      <Row className={`mmt-header mmt-header-team`}>
         <Col className={`mmt-col-user`}>
            <Flex column vAlign="center" className={'mmt-header-user'}>
               <Text content={`User`} />
            </Flex>
         </Col>
         <Col className={`mmt-col-status`}>
            <Flex column vAlign="center" className={'mmt-header-status'}>
               <Text content={`Status`} />
            </Flex>
         </Col>
         <Col
            className={`mmt-col-priority`}
            xl={2} lg={2} md={2} sm={2}
         >
            <Flex column vAlign="center" className={'mmt-header-priority'}>
               <Text content={`Priority`} />
            </Flex>
         </Col>
         <Col className={`mmt-col-weight`}>
            <Flex column vAlign="center" className={'mmt-header-weight'}>
               <Text content={`Weight`} />
            </Flex>
         </Col>
         <Col className={`mmt-col-manager`}>
            <Flex column vAlign="center" className={'mmt-header-manager'}>
               <Text content={`Line Manager 1`} />
            </Flex>
         </Col>
         <Col className={`mmt-col-manager`}>
            <Flex column vAlign="center" className={'mmt-header-manager'}>
               <Text content={`Line Manager 2`} />
            </Flex>
         </Col>
      </Row>
   );
}

export default TeamGoalsHeader;