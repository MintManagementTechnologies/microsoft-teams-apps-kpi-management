import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Text } from '@fluentui/react-northstar';

import { IAppraisalApproverModel } from '../../../common/types/approver';
import { useAppDispatch } from '../../../store';

// export interface IApproverModel extends IUserModel {
//    level: number;
//    outcome: string;
//    comments: string;
// }

// export interface IGoalApproverModel extends IApproverModel {
//    goalId: string;
//    requiresReview: boolean;
//    approved: boolean;
// }

const AppraisalReviewContainer = (props: { approvers: IAppraisalApproverModel[], currentLevel: number, currentUserUPN: string, itemId: string, status: string, isDisabled: boolean }): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   const { approvers, currentLevel, currentUserUPN, itemId, status, isDisabled } = props;

   
   const [result, setResult] = useState(0);
   // const [requiresReview, setRequiresReview] = useState(false);
   // const [approved, setApproved] = useState(false);
   // const [outcome, setOutcome] = useState('');
   
   return (
      <>
         <Row xl={6} lg={6} md={3} sm={3} className='mmt-row-goalReview-inputs'>
            {approvers.map((a, i) =>
               <Col key={`goalApprovalComments-col-${i + 1}`}>
                  <Flex column gap="gap.small" className='mmt-goalApproval-comments'>
                     {i === 0 ?
                        <Text content={`${t('common:userRole.self')} ${t('Review')}`} size="small" weight="bold" />
                        :
                        <Text content={`${t('common:userRole.manager')} ${a.level} ${t('Review')}`} size="small" weight="bold" />
                     }
                     <Input className={''}
                        type="number"
                        defaultValue={a.outcome}
                        placeholder="Add your rating here..."
                        disabled={isDisabled || a.level !== currentLevel}
								onChange={(event, ctrl) => {
                           let updatedResult = ctrl?.value ? parseInt(ctrl?.value) : 0;
                           setResult(updatedResult);
                           //dispatch(singleGoalApprovalChanged(itemId, updatedComments, approved, requiresReview, outcome));
                        }}
                     />
                  </Flex>
                  <br/>
               </Col>
            )}
         </Row>
         {/* <Flex hAlign='end' fill className='mmt-goalReview-actions'>
            <Checkbox
               id="cb-requiresReview"
               label={`${t('formCheckbox-requiresReview')}`}
               disabled={isDisabled}
               checked={requiresReview}
               onChange={(event, ctrl) => {
                  let tmpOutcome = ctrl?.checked ? 'requiresReview' : '';
                  setOutcome(tmpOutcome);
                  setRequiresReview(ctrl?.checked || false);
                  setApproved(false);
                  dispatch(singleGoalApprovalChanged(itemId, comments, false, tmpOutcome === 'requiresReview', tmpOutcome));
               }}
            />
            <Checkbox
               id="cb-approved"
               label={`${t('common-approved')}`}
               disabled={isDisabled}
               checked={approved}
               onChange={(event, ctrl) => {
                  let tmpOutcome = ctrl?.checked ? 'approved' : '';
                  setOutcome(tmpOutcome);
                  setApproved(ctrl?.checked || false);
                  setRequiresReview(false);
                  dispatch(singleGoalApprovalChanged(itemId, comments, tmpOutcome === 'approved', false, tmpOutcome));
               }}
            />
         </Flex> */}
      </>
   );
};

export default AppraisalReviewContainer;
