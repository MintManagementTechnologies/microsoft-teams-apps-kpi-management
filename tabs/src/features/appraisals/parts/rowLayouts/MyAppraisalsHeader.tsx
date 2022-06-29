import { Col, Row } from 'react-bootstrap';

import { Flex, Text } from '@fluentui/react-northstar';

const MyAppraisalsHeader = (): JSX.Element => {
   return (
      <Row className={`mmt-header mmt-header-me mmt-header-appraisals`}>
         {/* <Col className={`mmt-col-user`}>
            <Flex column vAlign="center" className={'mmt-header-user'}>
               <Text content={`User`} />
            </Flex>
         </Col> */}
         <Col className={`mmt-col-status`}
            xl={1} lg={1} md={1} sm={1}>
            <Flex column vAlign="center" className={'mmt-header-status'}>
               <Text content={`Status`} />
            </Flex>
         </Col>
         <Col
            className={`mmt-col-review`}
         >
            <Flex column vAlign="center" className={'mmt-header-review'}>
               <Text content={`Self Review`} />
            </Flex>
         </Col>
         <Col className={`mmt-col-review`}>
            <Flex column vAlign="center" className={'mmt-header-reviewr'}>
               <Text content={`Line Manager 1 Review`} />
            </Flex>
         </Col>
         {/* <Col className={`mmt-col-review`}>
            <Flex column vAlign="center" className={'mmt-header-review'}>
               <Text content={`Line Manager 2 Review`} />
            </Flex>
         </Col> */}
         <Col className={`mmt-col-created`}>
            <Flex column vAlign="center" className={'mmt-header-created'}>
               <Text content={`Created`} />
            </Flex>
         </Col>
      </Row>
   );
}

export default MyAppraisalsHeader;