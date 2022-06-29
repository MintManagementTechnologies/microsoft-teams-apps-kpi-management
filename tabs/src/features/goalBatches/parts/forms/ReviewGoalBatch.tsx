import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import GoalDetailsBox from '../../../../components/goal/GoalDetailsBox';
import GoalReviewInputs from '../../../../components/goal/GoalReviewInputs';
import { RootState, useTypedSelector } from '../../../../store';
import { IGoalBatchItemModel } from '../../types';
import ReviewGoalBatchItemBtns from '../buttons/ReviewGoalBatchItemBtns';

const ReviewGoalBatch = (props: { isLoading: boolean, items: IGoalBatchItemModel[] }): JSX.Element => {
   const { isLoading, items } = props;
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);
   const { t, i18n } = useTranslation();

   if (items.length === 0) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`TODO GoalBatch: items is empty`}>
         </ErrorMessage>
      )
   }
   return (
      <Flex fill column gap={'gap.medium'} className='mmt-viewGoalBatch mmt-reviewGoals-container' >
         {items.map((x, i) =>
            <Flex column gap="gap.small" className={`mmt-viewGoalBatchItem-container mmt-reviewGoals-item-container ${x.kraTitle === selectedKRA ? '' : 'mmt-hidden'}`} key={`flex-goalOverviewBox-${i + 1}`}>
               <GoalDetailsBox key={`key-goalDetailsBox-${i + 1}`} item={x} />
               <GoalReviewInputs reviewInputs={[<></>]}>
                  <ReviewGoalBatchItemBtns id={x.id} groupedById={x.kraTitle} />
               </GoalReviewInputs>
            </Flex>
         )}
      </Flex>
   );
}

export default ReviewGoalBatch;