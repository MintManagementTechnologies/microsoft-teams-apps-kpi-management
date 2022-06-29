import { useTranslation } from 'react-i18next';
import { Button, EditIcon, Flex, Text } from '@fluentui/react-northstar';
import { useAppDispatch } from '../../../../store';
import { sliceChanged } from '../../appraisalSlice';
import { IAppraisalModel } from '../../types';

const ViewAppraisal = (props: {
   
   item: IAppraisalModel,
}): JSX.Element => {
   const { item } = props;
   const isLocked = false;
   
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   
   const handleOnEdit = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      dispatch(sliceChanged({ item: item, formState: 'edit' }));
   }

   return (
      <Flex vAlign="center" gap="gap.small">
         <Text content={item.description} />
         <Flex vAlign="center" column>
            <Button
               icon={<EditIcon />}
               title={`${t(`common:button.edit`)}`}
               key={'edit'}
               iconOnly
               text
               onClick={(event) => handleOnEdit(event)}
               disabled={isLocked}
            />
         </Flex>
      </Flex>
   );
}

export default ViewAppraisal;