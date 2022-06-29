import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, CloseIcon, Dialog, TrashCanIcon } from '@fluentui/react-northstar';

import { useDeleteCompetencyMutation } from '../../competencyService';

const DeleteCompetencyBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();

   const [open, setOpen] = useState(false);
   const [deleteCompetency, { isLoading: isLoadingDeleteCompetency, isError: isErrorDeleteCompetency, error: errorDeleteCompetency }] = useDeleteCompetencyMutation();

   const handleOnDelete = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      await deleteCompetency(id as number).unwrap().then((result) => {
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
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
            loading: isLoadingDeleteCompetency,
            disabled: isLoadingDeleteCompetency
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

export default DeleteCompetencyBtn;