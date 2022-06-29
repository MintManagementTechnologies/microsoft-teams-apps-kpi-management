import './GoalBatch.scss';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import {
    IAppraisalApproverModel, IApproverModel, IGoalApproverModel
} from '../../../common/types/approver';
import { log } from '../../../common/utils/customConsoleLog';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { RootState, useAppDispatch, useTypedSelector } from '../../../store';
import AppraisalReviewContainer from '../../../views/zOld/overviewPage/AppraisalReviewContainer';
import GoalContainer from '../../../views/zOld/overviewPage/GoalContainer';
import GoalReviewContainer from '../../../views/zOld/overviewPage/GoalReviewContainer';
import { goalBatchChanged } from '../goalBatchSlice';
import { IGoalModel } from '../types';

const GoalBatch = (props: { isLoading: boolean, items: IGoalModel[], approvers: IApproverModel[], selectedKeyResultAreaId: string }): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { view } = useParams<{ view: string }>();
   const dispatch = useAppDispatch();
   let selectedGoalBatch = useTypedSelector((state: RootState) => state.oldGoalBatch);
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);
   const { isLoading, items, approvers, selectedKeyResultAreaId } = props;

   const currentApprover = approvers.find(a => a.approverUPN === currentUser.upn);

   const item: IGoalApproverModel = {
      batchId: "batch1",
      goalId: "a1111",
      approverUPN: "abrie@ajacsrsa1.onmicrosoft.com",
      creatorUPN: "abrie@ajacsrsa1.onmicrosoft.com",
      outcome: "pending",
      status: "approvalInProgress",
      level: 1,
      comments: "",
      approved: false,
      requiresReview: false,
      id: "g1-a1111",
      title: "Product & Service Innovation",
      createdTimestamp: 1646507557937,
      active: true
   };
   useEffect(() => {
      const invalidApprover = (): boolean => {
         if (!currentApprover) {
            log(`User is not an approver`, 'warning');
            return true;
         }
         return false;
      }

      const batchAlreadyExists = (): boolean => {
         if (selectedGoalBatch.length > 0) {
            log(`There is already a selected batch`, 'warning');
            return true;
         }
         return false;
      }

      if (invalidApprover() || batchAlreadyExists()) return;
      const goalBatch = items.map(x => ({
         ...currentApprover,
         goalId: x.id,
         requiresReview: currentApprover!.outcome === 'requiresReview',
         approved: currentApprover!.outcome === 'approved',
      }));
      dispatch(goalBatchChanged(goalBatch));
   }, [currentApprover, items, selectedGoalBatch.length, dispatch]);


   if (items.length === 0 || selectedGoalBatch.length === 0) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`GoalBatch: items is empty`}>
            <Text content={`currentUserUPN: ${currentUser.upn}`} />
            <Text content={`approvers: ${JSON.stringify(approvers)}`} />
            <Text content={`currentApprover: ${JSON.stringify(currentApprover)}`} />
            <Text content={`total selectedGoalBatch: ${selectedGoalBatch.length}`} />
            <Text content={`selectedKeyResultAreaId: ${selectedKeyResultAreaId}`} />
         </ErrorMessage>
      )
   }

   return (
      <>
         {items.map((x, i) =>
            <Flex column gap="gap.small" className={`mmt-goalOverview-container ${x.kraId === selectedKeyResultAreaId ? '' : 'mmt-hidden'}`} key={`flex-goalOverviewBox-${i + 1}`}>
               <GoalContainer key={`key-goalOverviewBox-${i + 1}`} item={x} />
               {view === 'mygoals' ?
                  <GoalReviewContainer
                     approvers={approvers}
                     currentLevel={x.batchCurrentLevel}
                     currentUserUPN={currentUser.upn}
                     status={x.status}
                     itemId={x.id}
                     isDisabled={currentApprover === undefined || currentApprover?.level !== x.batchCurrentLevel} />
                  :
                  <AppraisalReviewContainer
                     approvers={approvers as IAppraisalApproverModel[]}
                     currentLevel={x.batchCurrentLevel}
                     currentUserUPN={currentUser.upn}
                     status={x.status}
                     itemId={x.id}
                     isDisabled={currentApprover === undefined || currentApprover?.level !== x.batchCurrentLevel} />
               }
            </Flex>
         )}
      </>
   );
}

export default GoalBatch;
