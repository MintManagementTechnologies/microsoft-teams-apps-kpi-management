import { useState } from 'react';

import { Button, Flex, MoreIcon, Popup } from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import { itemChanged } from '../../competencySlice';
import { ICompetencyModel, newCompetency } from '../../types';
import DeleteCompetencyBtn from './DeleteCompetencyBtn';
import EditCompetencyBtn from './EditCompetencyBtn';

const ItemActionsPopup = (props: {
   actions: string[],
   item: ICompetencyModel,
}): JSX.Element => {
   const { actions, item } = props;

   const [open, setOpen] = useState(false);
   const dispatch = useAppDispatch();

   const availableActions = actions.map(x => {
      if (x === 'edit') return <EditCompetencyBtn id={item.id} key={`itemActions-edit-${item.id}`} />
      if (x === 'delete') return <DeleteCompetencyBtn id={item.id} key={`itemActions-delete-${item.id}`} />
   })

   const handleOnOpen = (_event: any, _isOpen: boolean) => {
      if (_event !== null) _event.preventDefault();
      setOpen(_isOpen);
      // dispatch(itemChanged(_isOpen ? item : newCompetency));
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
