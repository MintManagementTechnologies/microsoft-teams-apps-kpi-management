import { useState } from 'react';

import {
    Button, EditIcon, EyeFriendlierIcon, Flex, MoreIcon, Popup
} from '@fluentui/react-northstar';

import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { itemChanged as batchItemChanged } from '../../../goalBatches/goalBatchSlice';
import ViewGoalBatchBtn from '../../../goalBatches/parts/buttons/ViewGoalBatchBtn';
import { itemChanged } from '../../goalSlice';
import { IGoalModel, newGoal } from '../../types';
import DeleteGoalBtn from './DeleteGoalBtn';
import EditGoalBtn from './EditGoalBtn';
import ViewGoalBtn from './ViewGoalBtn';

const ItemActionsPopup = (props: {
   actions: string[],
   item: IGoalModel,
}): JSX.Element => {
   const { actions, item } = props;

   const [open, setOpen] = useState(false);
   const dispatch = useAppDispatch();
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedGoalBatches = useTypedSelector((state: RootState) => state.goalBatch.list);

   const availableActions = actions.map(x => {
      if (x === 'view') return <ViewGoalBtn id={item.id} key={`itemActions-view-${item.id}`} text icon={<EyeFriendlierIcon />} />
      if (x === 'edit') return <EditGoalBtn id={item.id} key={`itemActions-edit-${item.id}`} text icon={<EditIcon />} />
      if (x === 'delete') return <DeleteGoalBtn id={item.id} key={`itemActions-delete-${item.id}`} />
      if (x === 'viewBatch') return <ViewGoalBatchBtn id={item.batchId} userId={item.userId} key={`itemActions-viewBatch-${item.userId}`} />
   })

   const handleOnClick = (_event: any) => {
      if (_event !== null) _event.preventDefault();
   }

   const handleOnOpen = (_event: any, _isOpen: boolean) => {
      if (_event !== null) _event.preventDefault();
      setOpen(_isOpen);
      if (_isOpen) {
         const currentGoalBatch = selectedGoalBatches.find(x => x.id === item.batchId) || selectedGoalBatch;
         dispatch(batchItemChanged(currentGoalBatch));
      } else {
         // dispatch(batchItemChanged(null));
      }
      // dispatch(itemChanged(_isOpen ? item : newGoal));
   }

   return (
      <Popup
         on="focus"
         key={`itemActions-popup-${item.id}`}
         content={
            <Flex column key={`itemActions-content-${item.id}`} hAlign="start">
               {availableActions}
            </Flex>
         }
         position={'below'}
         trigger={<Button icon={<MoreIcon />} text iconOnly title="More" />}
         onOpenChange={(e, { open }: any) => handleOnOpen(e, open)}
         open={open}
      />
   );
};

export default ItemActionsPopup;
