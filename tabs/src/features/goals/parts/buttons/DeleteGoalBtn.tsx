import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, CloseIcon, Dialog, TrashCanIcon } from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import { useDeleteGoalMutation } from '../../goalService';
import { itemDeleted } from '../../goalSlice';

const DeleteGoalBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [open, setOpen] = useState(false);
   const [deleteGoal, { isLoading: isLoadingDeleteGoal, isError: isErrorDeleteGoal, error: errorDeleteGoal }] = useDeleteGoalMutation();

   const handleOnDelete = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      await deleteGoal(id as number).unwrap().then((result) => {
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
            dispatch(itemDeleted({id: id}))
            setOpen(false);
         } else {
            debugger;
         }
      }).catch((error) => {
         debugger;
      });
   }

   return (
      <Dialog
         open={open}
         onOpen={() => setOpen(true)}
         onCancel={() => setOpen(false)}
         cancelButton={`${t(`common:button.no`)}`}
         onConfirm={handleOnDelete}
         confirmButton={{
            content: `${t(`common:button.yes`)}`,
            loading: isLoadingDeleteGoal,
            disabled: isLoadingDeleteGoal
         }}
         content={`${t(`common:msg.deleteConfirmation`)}`}
         header={`${t(`common:msg.deleteConfirmationHeader`)} (${id})`}
         headerAction={{
            icon: <CloseIcon />,
            title: `${t(`common:button.close`)}`,
            onClick: () => setOpen(false),
         }}
         trigger={
            <Button
               content={`${t(`common:button.delete`)}`}
               icon={<TrashCanIcon />}
               text
            />}
      />
   );
}

export default DeleteGoalBtn;