import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, Checkbox, EditIcon, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectGoal } from '../../../goals/goalSelectors';
import { formResultAdded, formResultRemoved } from '../../goalBatchSlice';
import { IGoalBatchItemReviewModel } from '../../types';

const ReviewGoalBatchItemBtns = (props: { id: string | number, groupedById: string | number, isApproved?: boolean }): JSX.Element => {
   const { id, groupedById, isApproved } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   
   const [outcome, setOutcome] = useState(isApproved !== undefined ? (isApproved ? 'approved' : 'requiresReview') : '');
   const tst = [] as [];
   // const selectedItemState = useSelector(selectGoal);

   const handleOnCheck = async (_event: any, _outcome: string) => {
      if (_event !== null) _event.preventDefault();
      if(!_outcome){
         dispatch(formResultRemoved(id))
      } else {
         const reviewOutcome:IGoalBatchItemReviewModel = {
            kraTitle: groupedById.toString(),
            kraId: 0,
            goalId: id as number,
            approved: _outcome === 'approved'
         }
         dispatch(formResultAdded(reviewOutcome));
      }
      setOutcome(_outcome);
   }

   return (
      <>
         <Checkbox
            id="cb-requiresReview"
            label={`${t('form.goalReview.label.requiresReview')}`}
            disabled={false}
            checked={outcome === 'requiresReview'}
            onChange={(event, ctrl) => {
               let tmpOutcome = ctrl?.checked ? 'requiresReview' : '';
               handleOnCheck(event, tmpOutcome);
            }}
         />
         <Checkbox
            id="cb-approved"
            label={`${t('form.goalReview.label.approved')}`}
            disabled={false}
            checked={outcome === 'approved'}
            onChange={(event, ctrl) => {
               let tmpOutcome = ctrl?.checked ? 'approved' : '';
               handleOnCheck(event, tmpOutcome);
            }}
         />
      </>
   );
}

export default ReviewGoalBatchItemBtns;