import { useTranslation } from 'react-i18next';

import { Button, EditIcon, Flex, Input, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { formResultAdded } from '../../appraisalSlice';
import { IAppraisalGoalModel, IAppraisalGoalReviewModel, IAppraisalX } from '../../types';

const AppraisalGoalReviewInput = (props: { item: IAppraisalGoalModel, reviewInputIndex: number, isDisabled: boolean }): JSX.Element => {
   const { item, reviewInputIndex, isDisabled } = props;
   const defaultGoalReview = item.reviews[reviewInputIndex];
   const defaultValue = defaultGoalReview?.outcome === 0 ? '' : defaultGoalReview?.outcome.toString();
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedAppraisal = useTypedSelector((state: RootState) => state.appraisal.item);
   const selectedAppraisalGoalReview
      = useTypedSelector((state: RootState) =>
         (state.appraisal.formResult as IAppraisalGoalReviewModel[]).find(x => x.goalId === item.id)
      );
   const reviewer = selectedAppraisal.reviews[reviewInputIndex];

   const handleOnInputChange = async (_outcome: number) => {
      const reviewOutcome: IAppraisalGoalReviewModel = {
         goalId: item.id as number,
         completed: false,
         kraTitle: item.kraTitle,
         kraId: item.kraId,
         userId: reviewer.userId,
         upn: reviewer.upn,
         order: reviewInputIndex,
         outcome: _outcome
      }
      dispatch(formResultAdded(reviewOutcome));
   }

   if(!reviewer){
      return (<ErrorMessage message={`Reviewer ${reviewInputIndex+1} not found`} />)
   }

   return (
      <Flex column gap="gap.small" className='mmt-reviewGoal'>
         {reviewInputIndex === 0 ?
            <Text content={`${t('form.appraisalReview.label.self')}`} size="small" weight="bold" />
            :
            <Text content={`${t('form.appraisalReview.label.reviewerByIndex', { index: reviewInputIndex })}`} size="small" weight="bold" />
         }
         <Input className={''}
            type="number"
            placeholder={`${t('form.appraisalReview.label.placeholder')}`}
            defaultValue={defaultValue}
            disabled={isDisabled}
            min="1" max={item.weight.toString()}
            onChange={(event, ctrl) => {
               if (event !== null) event.preventDefault();
               let updatedResult = ctrl?.value ? parseFloat(ctrl?.value) : 0;
               handleOnInputChange(updatedResult);
            }}
            fluid
         />
      </Flex>
   );
}

export default AppraisalGoalReviewInput;