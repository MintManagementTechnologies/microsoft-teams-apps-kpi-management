import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import ErrorMessage from '../../components/common/ErrorMessage';
import {
    useGetAppraisalGoalsQuery, useGetAppraisalReviewHistoryQuery
} from '../../features/appraisals/appraisalService';
import { itemListChanged } from '../../features/appraisals/appraisalSlice';
import SubmitAppraisalReviewBtn from '../../features/appraisals/parts/buttons/SubmitAppraisalReviewBtn';
import ReviewAppraisalGoals from '../../features/appraisals/parts/forms/ReviewAppraisalGoals';
import {
    IAppraisalGoalModel, IAppraisalGoalReviewModel, IReviewHistoryItem
} from '../../features/appraisals/types';
import { selectAllGoalKRAs } from '../../features/keyResultAreas/keyResultAreaSlice';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import BrowseGoalReviews from '../shared/BrowseGoalReviews';
import BrowseGoalReviewsLayout from '../shared/BrowseGoalReviewsLayout';

const AppraisalReviewContainer = (): JSX.Element => {

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   const { userScope, batchId, userId } = useParams<{ userScope: string, batchId: string, userId: string }>();
   const [isValid, setIsValid] = useState(userScope === 'hr');
   const [activeIsValid, setActiveIsValid] = useState(false);
   const [currentReviewer, setCurrentReviewer] = useState<IReviewHistoryItem>();

   const selectedEmployee = useTypedSelector((state: RootState) => state.employee.item);
   const usersUPN = [selectedEmployee.upn, ...selectedEmployee.managers.map(x => x.upn)];
   const selectedAllGoalKRAs = useSelector(selectAllGoalKRAs);
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);
   const selectedAppraisal = useTypedSelector((state: RootState) => state.appraisal.item);
   const selectedFormState = useTypedSelector((state: RootState) => state.appraisal.formState);
   const selectedFormResult
      = useTypedSelector((state: RootState) => state.appraisal.formResult) as IAppraisalGoalReviewModel[];

   const selectedAppraisalGoals = useTypedSelector((state: RootState) => state.appraisal.item.goals);
   const appraisalGoalsSearchModel = (userId && batchId) ? { userId: parseInt(userId), batchId: parseInt(batchId) } : undefined;
   const { data: dataGetAppraisalGoals, isFetching: isFetchingGetAppraisalGoals, isLoading: isLoadingGetAppraisalGoals }
      = useGetAppraisalGoalsQuery(appraisalGoalsSearchModel || skipToken);
   const { data: dataGetAppraisalReviewHistory, isFetching: isFetchingGetAppraisalReviewHistory, isLoading: isLoadingGetAppraisalReviewHistory }
      = useGetAppraisalReviewHistoryQuery(batchId ? parseInt(batchId) : skipToken);

   useEffect(() => {
      if (!dataGetAppraisalGoals) return;
      dispatch(itemListChanged(dataGetAppraisalGoals));
   }, [dataGetAppraisalGoals])

   useEffect(() => {
      if (!dataGetAppraisalReviewHistory || !selectedAppraisal || selectedAppraisal.id === 0) return;
      const tmpCurrentReviewer = dataGetAppraisalReviewHistory.find(x => x.level === selectedAppraisal.currentLevel);
      setCurrentReviewer(tmpCurrentReviewer);
      if(selectedAppraisal.currentLevel === 2){
         setIsValid(true);
      }
   }, [dataGetAppraisalReviewHistory, selectedAppraisal])

   useEffect(() => {
      if (!selectedFormResult) return;
      const currentKRA = selectedAllGoalKRAs.find(x => x.id === selectedKRA);
      if (!currentKRA) return;
      const currentGoalBatchItems = selectedAppraisalGoals.filter(x => x.kraTitle === currentKRA.id);
      const currentGoalBatchItemResults = selectedFormResult.filter(x => x.kraTitle === currentKRA.id && x.completed);
      setActiveIsValid(currentGoalBatchItems.length === currentGoalBatchItemResults.length);
   }, [selectedFormResult, selectedKRA])

   if (!(userId && batchId)) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`GoalBatchReviewWrapper: items is empty`}>
            <Text content={`userId: ${userId}`} />
            <Text content={`total allKeyResultAreas: ${selectedAllGoalKRAs.length}`} />
         </ErrorMessage>
      )
   }

   const isLoading = isLoadingGetAppraisalGoals || isFetchingGetAppraisalGoals;
   return (
      <BrowseGoalReviewsLayout
         userDisplayName={selectedEmployee.title}
         disableNextBtn={!(isValid || activeIsValid)}
         completeReviewBtn={<SubmitAppraisalReviewBtn disabled={!(isValid || activeIsValid)} usersUPN={usersUPN} />}
      >
         <BrowseGoalReviews isLoading={isLoading} employeeId={parseInt(userId)} reviewDescription={t('form.appraisalReview.description')}>
            <ReviewAppraisalGoals isLoading={isLoading} items={selectedAppraisalGoals as IAppraisalGoalModel[]} currentReviewer={currentReviewer} />
         </BrowseGoalReviews>
      </BrowseGoalReviewsLayout>
   )
}

export default AppraisalReviewContainer;