import React, { cloneElement, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Checkbox, Flex, Input, Text, TextArea } from '@fluentui/react-northstar';

// const ReviewGoalBatchItem = (props: { totalReviewers: number, currentReviewerIndex: number, inputRequired?: boolean, isDisabled?: boolean, children?: React.ReactNode }): JSX.Element => {
// const { totalReviewers, currentReviewerIndex, inputRequired, isDisabled } = props;
const GoalReviewInputs = (props: { reviewInputs?: JSX.Element[], children?: React.ReactNode }): JSX.Element => {
   const { reviewInputs } = props;
   // const childrenWithProps = React.Children.map(props.children, child => {
   //    // Checking isValidElement is the safe way and avoids a typescript
   //    // error too.
   //    if (React.isValidElement(child)) {
   //       return React.cloneElement(child, { color: "red" });
   //    }
   //    return child;
   // });

   return (
      <>
         <Row xl={3} lg={3} md={2} sm={1} className='mmt-row-goalReview-inputs'>
            {reviewInputs?.map((element, i) => {
               return (
                  <Col key={`key-reviewGoalBatchItem-input-${i + 1}`}>
                     {element}
                     <br />
                  </Col>
               )
            })
            }
         </Row>
         <Flex hAlign='end' fill className='mmt-goalReview-actions'>
            {/* {props.children && childrenWithProps} */}
            {props.children}
         </Flex>
      </>
   );
};

export default GoalReviewInputs;
