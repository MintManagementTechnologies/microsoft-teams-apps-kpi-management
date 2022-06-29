import * as React from 'react';
import { getSingleCommand, ICommand } from '../../../commands/commands';
import CommandsPopup from '../../../commands/CommandsPopup';
import { IHeader } from '../Header';

export const headerGroupItemsActions: IHeader = {
   headerDisplayName: '',
   maxWidth: '200px',
   fieldInternalName: 'groupContextActions',
};

const GroupItemsActions = (props: { itemId: string }): JSX.Element => {
   const { itemId } = props;

   const approvalFormCommand = getSingleCommand('approvalForm')!;
   const conversationCommand = getSingleCommand('userGoalsConversation')!;
   const meetingCommand = getSingleCommand('userGoalsMeeting')!;
   const cmds: ICommand[] = [approvalFormCommand, conversationCommand, meetingCommand];

   return (
      <CommandsPopup itemId={itemId} commands={cmds} />
   );
}

export default GroupItemsActions;