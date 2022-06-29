import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, EditIcon, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { selectCompetency } from '../../competencySelectors';
import { useLazyGetCompetenciesByWorkgradeQuery } from '../../competencyService';

const EditCompetencyBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectCompetency);
   const selectedWorkGrade = useTypedSelector((state: RootState) => state.workgrade.itemId);

   const [trigger] = useLazyGetCompetenciesByWorkgradeQuery();

   const handleCallback = async (result: any) => {
      const _dialogResult = result as { action: string, additionalInfo: any };
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         trigger(selectedWorkGrade);
      } else {
         console.log("DONT REFRESH");
      }
   }

   return (
      <TaskModuleButton
         title={`${t(`modal.hrAdmin.competency.headerAction`, { action: t(`common:button.edit`) })}`}
         path={`hr/competency/edit/${id}`}
         content={`${t(`common:button.edit`)}`}
         icon={<EditIcon />}
         text
         callback={handleCallback}
      />
   );
}

export default EditCompetencyBtn;