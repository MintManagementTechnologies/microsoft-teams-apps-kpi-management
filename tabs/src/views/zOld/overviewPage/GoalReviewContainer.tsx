import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Checkbox, Flex, Text, TextArea } from '@fluentui/react-northstar';

import { IApproverModel } from '../../../common/types/approver';
import { singleGoalApprovalChanged } from '../../../features/goalsOld/goalBatchSlice';
import { useAppDispatch } from '../../../store';

const GoalReviewContainer = (props: { approvers: IApproverModel[], currentLevel: number, currentUserUPN: string, itemId: string, status: string, isDisabled: boolean }): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   const { approvers, currentLevel, currentUserUPN, itemId, status, isDisabled } = props;

   
   const [comments, setComments] = useState('');
   const [requiresReview, setRequiresReview] = useState(false);
   const [approved, setApproved] = useState(false);
   const [outcome, setOutcome] = useState('');
   
   return (
      <>
         <Row xl={6} lg={6} md={3} sm={3}>
            {approvers.map((a, i) =>
               <Col key={`goalApprovalComments-col-${i + 1}`}>
                  <Flex column gap="gap.small" className='mmt-goalApproval-comments '>
                     {approvers.length !== i+1 ?
                        <Text content={`${t('common:userRole.manager')} ${a.level} ${t('Comments')}`} className="mmt-label" />
                        :
                        <Text content={`${t('common:userRole.hr')} ${t('Comments')}`} className="mmt-label" />
                     }
                     <TextArea className={''}
                        defaultValue={a.comments}
                        placeholder="Add your comments here..."
                        variables={{
                           height: '100px',
                        }}
                        disabled={isDisabled || a.level !== currentLevel}
								onChange={(event, ctrl) => {
                           let updatedComments = ctrl?.value || '';
                           setComments(updatedComments);
                           dispatch(singleGoalApprovalChanged(itemId, updatedComments, approved, requiresReview, outcome));
                        }}
                     />
                  </Flex>
               </Col>
            )}
         </Row>
         <Flex hAlign='end' fill className='mmt-goalReview-actions'>
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
         </Flex>
      </>
   );
};

export default GoalReviewContainer;
