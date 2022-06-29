import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import GoalDetailsBox from '../../../../components/goal/GoalDetailsBox';
import GoalReviewInputs from '../../../../components/goal/GoalReviewInputs';
import { RootState, useTypedSelector } from '../../../../store';
import { IAppraisalGoalModel, IReviewHistoryItem } from '../../types';
import ReviewAppraisalGoalBtn from '../buttons/ReviewAppraisalGoalBtn';
import AppraisalGoalReviewInput from './AppraisalGoalReviewInput';

const ReviewAppraisalGoals = (props: { isLoading: boolean, items: IAppraisalGoalModel[], currentReviewer?: IReviewHistoryItem }): JSX.Element => {
   const { isLoading, items, currentReviewer } = props;
   const selectedAppraisal = useTypedSelector((state: RootState) => state.appraisal.item);
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const isValidReviewer = currentReviewer && selectedCurrentEmployee.id === currentReviewer.userId;
   const { t, i18n } = useTranslation();

   if (items.length === 0) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`TODO ReviewAppraisalGoals: items is empty`}>
         </ErrorMessage>
      )
   }

   const renderReviewInputs = (_goal: IAppraisalGoalModel,) => {
      const inputList: JSX.Element[] = [];
      _goal.reviews.forEach((x, i) => {
         inputList.push(
            <AppraisalGoalReviewInput
               key={`key-appraisalGoalReviewInput-${i + 1}`}
               item={_goal}
               reviewInputIndex={i}
               isDisabled={selectedAppraisal.currentLevel !== i || selectedAppraisal.status === 'approved' || !isValidReviewer }
            />)
      });
      return inputList;
   }

   return (
      <Flex fill column gap={'gap.medium'} className='mmt-appraisalGoals mmt-reviewGoals-container' >
         {items.map((x, i) =>
            <Flex column gap="gap.small" className={`mmt-appraisalGoalItem-container mmt-reviewGoals-item-container ${x.kraTitle === selectedKRA ? '' : 'mmt-hidden'}`} key={`flex-goalOverviewBox-${i + 1}`}>
               <GoalDetailsBox key={`key-goalDetailsBox-${i + 1}`} item={x} />
               <GoalReviewInputs reviewInputs={renderReviewInputs(x)}>
                  <ReviewAppraisalGoalBtn id={x.id} groupedById={x.kraTitle} />
               </GoalReviewInputs>
            </Flex>
         )}
      </Flex>
   );
}

export default ReviewAppraisalGoals;
