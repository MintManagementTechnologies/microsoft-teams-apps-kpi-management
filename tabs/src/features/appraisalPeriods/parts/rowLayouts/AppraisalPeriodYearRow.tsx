
import { Col, Row } from 'react-bootstrap';

import { TableCell, TableRow, Text } from '@fluentui/react-northstar';

import { IAppraisalPeriodModel } from '../../types';

const AppraisalPeriodYearRow = (props: { content: any }): JSX.Element => {
   const { content } = props;

   return (
      <Row className={`mmt-`}>
         <Col className={`mmt-`}>
            <Text content={content} weight="semibold" />
         </Col>
      </Row>
   );
}

export default AppraisalPeriodYearRow;