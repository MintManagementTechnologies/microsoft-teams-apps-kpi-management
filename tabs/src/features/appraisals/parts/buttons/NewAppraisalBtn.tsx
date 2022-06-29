import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { AddIcon, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectAppraisal } from '../../appraisalSelectors';

const NewAppraisalBtn = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectAppraisal);

   const handleCallback = async (result: any) => {
      const _dialogResult = result as { action: string, additionalInfo: any };
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         // trigger(selectedWorkGrade);
      } else {
         console.log("DONT REFRESH");
      }
   }

   const id = uuid();
   const entity = 'appraisal';
   return (
      <Flex>
         <TaskModuleButton
            title={`${t(`modal.myAppraisals.appraisal.headerAction`, {action: t(`common:button.create`)})}`}
            path={`me/appraisal/new/${id}`}
            content={`${t(`common:button.newEntity`, { entity: t(`entity.${entity}`, { count: 1 }) })}`}
            icon={<AddIcon />}
            primary
            callback={handleCallback}
         />
      </Flex>
   );
}

export default NewAppraisalBtn;