import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button, Flex, Input, PresenceAvailableIcon, SaveIcon, Segment
} from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../store';
import { sliceChanged } from '../keyResultAreaSlice';
import { IKeyResultAreaModel, newKeyResultArea } from '../types';
import DeleteKeyResultAreaBtn from './buttons/DeleteKeyResultAreaBtn';

const EditKeyResultArea = (props: {
   item: IKeyResultAreaModel,
}): JSX.Element => {
   const { item } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item);
   const [isValid, setIsValid] = useState(false);

   useEffect(() => {
      if (!itemState) return;
      setIsValid(itemState.title.length > 2);
   }, [itemState]);


   const handleOnSave = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      if (itemState.title !== item.title)
         dispatch(sliceChanged({ item: itemState, triggerApi: true }));
      else {
         dispatch(sliceChanged({ item: newKeyResultArea, triggerApi: false }));
      }
   }

   const handleMultiInputChange = (_event: any, keyValuePair: { field: string, value: any }[]) => {
      if (_event !== null) _event.preventDefault();

      let _item = { ...item };
      keyValuePair.forEach(x => {
         //@ts-ignore
         _item[x.field] = x.value;
      });
      setItemState(_item);
   }

   return (
      <Segment>
         <Flex vAlign="end" gap="gap.small">
            <Input
               label={t('form.kra.label')}
               placeholder={t('form.kra.placeholder')}
               defaultValue={itemState?.title}
               onChange={
                  (event, ctrl) => handleMultiInputChange(event, [
                     { field: `title`, value: ctrl?.value || '' }
                  ])
               }
               fluid
               successIndicator={<PresenceAvailableIcon />}
               required
            />
            <Flex vAlign="end" fill gap="gap.small">
               <Flex gap="gap.medium">
                  <Button
                     icon={<SaveIcon size="large" />}
                     title={`${t(`common:button.save`)}`}
                     key={'save'}
                     iconOnly
                     text={!isValid}
                     circular={isValid}
                     primary={isValid}
                     disabled={!isValid}
                     onClick={(event) => handleOnSave(event)}
                  />
                  <DeleteKeyResultAreaBtn id={itemState.id} />
               </Flex>
            </Flex>
         </Flex>
      </Segment>
   );
}

export default EditKeyResultArea;