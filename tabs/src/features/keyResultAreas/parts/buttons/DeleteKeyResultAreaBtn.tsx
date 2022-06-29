import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, CloseIcon, Dialog, TrashCanIcon } from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import { useDeleteKeyResultAreaMutation } from '../../keyResultAreaService';
import { sliceChanged } from '../../keyResultAreaSlice';

const DeleteKeyResultAreaBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [open, setOpen] = useState(false);
   const [deleteKeyResultArea, { isLoading: isLoadingDeleteKeyResultArea, isError: isErrorDeleteKeyResultArea, error: errorDeleteKeyResultArea }] = useDeleteKeyResultAreaMutation();

   const handleOnDelete = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      if (id === 0) {
         dispatch(sliceChanged({ formState: 'delete', triggerApi: false }));
      }
      else {
         await deleteKeyResultArea(id as number).unwrap().then((result) => {
            if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success') {
               dispatch(sliceChanged({ formState: 'delete', triggerApi: true }));
               setOpen(false);
            } else {
               debugger;
            }
         }).catch((error) => {
            debugger;
         });
      }
   }

   return (
      <>
         {id === 0 ?
            <Button
               icon={<TrashCanIcon />}
               title={`${t(`common:button.delete`)}`}
               key={'delete'}
               iconOnly
               text
               onClick={handleOnDelete}
            />
            :
            <Dialog
               open={open}
               onOpen={() => setOpen(true)}
               onCancel={() => setOpen(false)}
               cancelButton={`${t(`common:button.no`)}`}
               onConfirm={handleOnDelete}
               confirmButton={{
                  content: `${t(`common:button.yes`)}`,
                  loading: isLoadingDeleteKeyResultArea,
                  disabled: isLoadingDeleteKeyResultArea
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
                     icon={<TrashCanIcon />}
                     title={`${t(`common:button.delete`)}`}
                     key={'delete'}
                     iconOnly
                     text
                  />
               }
            />
         }
      </>
   );
}

export default DeleteKeyResultAreaBtn;