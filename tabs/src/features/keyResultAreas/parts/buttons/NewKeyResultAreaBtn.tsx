import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { AddIcon, Button, Flex } from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import { selectKeyResultAreaFormState, sliceChanged } from '../../keyResultAreaSlice';
import { newKeyResultArea } from '../../types';

const NewKeyResultAreaBtn = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedFormState = useSelector(selectKeyResultAreaFormState);

   const handleOnClick = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      dispatch(sliceChanged({ item: newKeyResultArea, formState: 'new' }));
   }

   const entity = 'abbrKRA';
   return (
      <Flex>
         <Button disabled={selectedFormState === 'new'}
            content={`${t(`common:button.newEntity`, { entity: t(`entity.${entity}`, { count: 1 }) })}`}
            icon={<AddIcon />}
            primary
            onClick={handleOnClick}
         />
      </Flex>
   );
}

export default NewKeyResultAreaBtn;