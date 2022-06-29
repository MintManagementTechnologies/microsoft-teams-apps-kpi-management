import { useState } from 'react';

import { Button, Flex, MoreIcon, Popup } from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import { itemChanged } from '../../appraisalPeriodSlice';
import { IAppraisalPeriodModel, newAppraisalPeriod } from '../../types';
import DeleteAppraisalPeriodBtn from './DeleteAppraisalPeriodBtn';
import EditAppraisalPeriodBtn from './EditAppraisalPeriodBtn';

const ItemActionsPopup = (props: {
   actions: string[],
   item: IAppraisalPeriodModel,
}): JSX.Element => {
   const { actions, item } = props;

   const [open, setOpen] = useState(false);
   const dispatch = useAppDispatch();

   const availableActions = actions.map(x => {
      if (x === 'edit') return <EditAppraisalPeriodBtn id={item.id} key={`itemActions-edit-${item.id}`} />
      if (x === 'delete') return <DeleteAppraisalPeriodBtn id={item.id} key={`itemActions-delete-${item.id}`} />
   })

   const handleOnOpen = (_event: any, _isOpen: boolean) => {
      if (_event !== null) _event.preventDefault();
      setOpen(_isOpen);
      // dispatch(itemChanged(_isOpen ? item : newAppraisalPeriod));
   }

   return (
      <Popup
         on="focus"
         key={`itemActions-popup-${item.id}`}
         content={
            <Flex column key={`itemActions-content-${item.id}`} hAlign="start" className={`mmt-itemActionsPopup`}>
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
