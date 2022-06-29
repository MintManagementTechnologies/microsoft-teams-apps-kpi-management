import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@fluentui/react-northstar';

import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { useSaveAppraisalGoalReviewMutation } from '../../appraisalService';
import { formResultCompleted } from '../../appraisalSlice';
import { IAppraisalGoalReviewModel } from '../../types';

const ReviewAppraisalGoalBtn = (props: { id: string | number, groupedById: string | number, isApproved?: boolean }): JSX.Element => {
   const { id, groupedById, isApproved } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [outcome, setOutcome] = useState(isApproved !== undefined ? (isApproved ? 'approved' : 'requiresReview') : '');
   const selectedAppraisalGoalReview
      = useTypedSelector((state: RootState) =>
         (state.appraisal.formResult as IAppraisalGoalReviewModel[]).find(x => x.goalId === id)
      );
   const selectedAppraisalGoalWeight = useTypedSelector((state: RootState) => (state.appraisal.item.goals).find(x => x.id === id))?.weight || 0;

   const [saveAppraisalGoalReview, { isLoading: isLoadingSaveAppraisalGoalReview }]
      = useSaveAppraisalGoalReviewMutation();

   const handleOnClick = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      if (!selectedAppraisalGoalReview) return;
      saveAppraisalGoalReview(selectedAppraisalGoalReview).unwrap().then((result) => {
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success' || result.status.toLowerCase() === 'pending') {
            const reviewOutcome: { goalId: number, completed: boolean } = {
               goalId: id as number,
               completed: true,
            }
            dispatch(formResultCompleted(reviewOutcome));
         }
      }).catch((error) => {
         debugger;
      })
   }

   const isDisabled = !(selectedAppraisalGoalReview && !selectedAppraisalGoalReview.completed) || isLoadingSaveAppraisalGoalReview || selectedAppraisalGoalReview.outcome > selectedAppraisalGoalWeight;
   return (
      <Button content={`${t('common:button.save')}`} tinted disabled={isDisabled} onClick={handleOnClick} loading={isLoadingSaveAppraisalGoalReview} />
   );
}

export default ReviewAppraisalGoalBtn;