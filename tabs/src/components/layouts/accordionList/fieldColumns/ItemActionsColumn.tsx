import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { gridCellMultipleFocusableBehavior } from '@fluentui/accessibility';
import { gridCellWithFocusableElementBehavior, TableCell } from '@fluentui/react-northstar';

import { IGoalModel } from '../../../../features/goalsOld/types';
import { getSingleCommand, ICommand } from '../../../commands/commands';
import CommandsPopup from '../../../commands/CommandsPopup';
import { actionManager } from '../../../commands/uiActions';
import { IHeader } from '../Header';

export interface IListItemActions {
   _actions: string[],
}

export const headerItemActions: IHeader = {
   headerDisplayName: '',
   maxWidth: '200px',
   fieldInternalName: 'contextActions',
};

const ItemActionsColumn = (props: { item: (IGoalModel & IListItemActions) }): JSX.Element => {
   const { pathname } = useLocation();
   const { item } = props;

   const actions = actionManager(pathname).getActions(item._actions);
   const cmds = actions.map(action => action.getCommand());

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerItemActions.fieldInternalName}`}
         key={`col-${headerItemActions.fieldInternalName}-${item.id}`}
         content={cmds.length > 0 ? <CommandsPopup itemId={item.id} commands={cmds} /> : <></>}
         styles={{
            maxWidth: headerItemActions.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
         accessibility={gridCellWithFocusableElementBehavior}
         onClick= {(e:any) => {
           e.stopPropagation()
         }}
         // accessibility={gridCellMultipleFocusableBehavior}
      />
   );
}

export default ItemActionsColumn;