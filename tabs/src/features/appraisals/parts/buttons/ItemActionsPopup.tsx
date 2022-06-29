import { useState } from 'react';

import { Button, ChatIcon, Flex, MeetingNewIcon, MoreIcon, Popup } from '@fluentui/react-northstar';

import CollaborationButton from '../../../../components/common/buttons/CollaborationButton';
import { useAppDispatch } from '../../../../store';
import { itemChanged } from '../../appraisalSlice';
import { IAppraisalX, newAppraisalX } from '../../types';
import ViewAppraisalGoalsBtn from './ViewAppraisalGoalsBtn';

const ItemActionsPopup = (props: {
   actions: string[],
   item: IAppraisalX,
}): JSX.Element => {
   const { actions, item } = props;

   const [open, setOpen] = useState(false);
   const dispatch = useAppDispatch();

   const availableActions = actions.map(x => {
      if (x === 'viewBatch') return <ViewAppraisalGoalsBtn id={item.id} userId={item.userId} key={`itemActions-viewBatch-${item.userId}`} />
      if (x === 'groupchat') return <CollaborationButton usersUPN={item.reviews.map(y => y.upn)} action={`groupchat`} icon={<ChatIcon />} key={`itemActions-groupchat-${item.userId}`} />
      if (x === 'meeting') return <CollaborationButton usersUPN={item.reviews.map(y => y.upn)} action={`meeting`} icon={<MeetingNewIcon />} key={`itemActions-meeting-${item.userId}`} />
   })

   const handleOnOpen = (_event: any, _isOpen: boolean) => {
      if (_event !== null) _event.preventDefault();
      if(_isOpen === open) return;
      setOpen(_isOpen);
      dispatch(itemChanged(_isOpen ? item : newAppraisalX));
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
