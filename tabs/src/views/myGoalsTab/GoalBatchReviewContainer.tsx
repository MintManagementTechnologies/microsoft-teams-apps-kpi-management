import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Text } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import ErrorMessage from '../../components/common/ErrorMessage';
import SubmitGoalBatchReviewBtn from '../../features/goalBatches/parts/buttons/SubmitGoalBatchReviewBtn';
import ReviewGoalBatch from '../../features/goalBatches/parts/forms/ReviewGoalBatch';
import { IGoalBatchItemModel } from '../../features/goalBatches/types';
import { itemIdChanged, selectAllGoalKRAs } from '../../features/keyResultAreas/keyResultAreaSlice';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import BrowseGoalReviews from '../shared/BrowseGoalReviews';
import BrowseGoalReviewsLayout from '../shared/BrowseGoalReviewsLayout';

const GoalBatchReviewContainer = (): JSX.Element => {
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   const { batchId, userId } = useParams<{ batchId: string, userId: string }>();
   const [isValid, setIsValid] = useState(true);
   const [activeIsValid, setActiveIsValid] = useState(false);

   const selectedEmployee = useTypedSelector((state: RootState) => state.employee.item);
   const usersUPN = [selectedEmployee.upn, ...selectedEmployee.managers.map(x => x.upn)];
   const selectedAllGoalKRAs = useSelector(selectAllGoalKRAs);
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);
   const selectedGoalBatchResult
      = useTypedSelector((state: RootState) => state.goalBatch.formResult) as { kraTitle: string, kraId: number, goalId: number, approved: boolean }[];

   const selectedGoals = useTypedSelector((state: RootState) => state.goal.list.filter(x => x.userId === selectedEmployee.id));
   // const { data: dataGetGoalsByBatchId, isFetching: isFetchingGetGoalsByBatchId, isLoading: isLoadingGetGoalsByBatchId }
   //    = useGetGoalsByBatchIdQuery(isValid ? parseInt(`${batchId}`) : skipToken);
   // = useGetGoalsByBatchIdQuery(batchId ? parseInt(batchId) : skipToken);

   useEffect(() => {
      if (!selectedGoalBatchResult) return;
      const currentKRA = selectedAllGoalKRAs.find(x => x.id === selectedKRA);
      if (!currentKRA) return;
      const currentGoalBatchItems = selectedGoals.filter(x => x.kraTitle === currentKRA.id);
      const currentGoalBatchItemResults = selectedGoalBatchResult.filter(x => x.kraTitle === currentKRA.id);
      setActiveIsValid(currentGoalBatchItems.length === currentGoalBatchItemResults.length);
   }, [selectedGoalBatchResult, selectedKRA]);

   if (!(userId && batchId)) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`GoalBatchReviewWrapper: userId || batchId missing`}>
            <Text content={`userId: ${userId}`} />
            <Text content={`batchId: ${batchId}`} />
            <Text content={`total allKeyResultAreas: ${selectedAllGoalKRAs.length}`} />
         </ErrorMessage>
      )
   }

   return (
      <BrowseGoalReviewsLayout
         userDisplayName={selectedEmployee.title}
         disableNextBtn={!activeIsValid}
         completeReviewBtn={<SubmitGoalBatchReviewBtn disabled={!(isValid && activeIsValid)} usersUPN={usersUPN} />}
      >
         <BrowseGoalReviews isLoading={false} employeeId={parseInt(userId)} reviewDescription={t('form.goalReview.description')}>
            <ReviewGoalBatch isLoading={false} items={selectedGoals as IGoalBatchItemModel[]} />
         </BrowseGoalReviews>
      </BrowseGoalReviewsLayout>
   )
}

export default GoalBatchReviewContainer;