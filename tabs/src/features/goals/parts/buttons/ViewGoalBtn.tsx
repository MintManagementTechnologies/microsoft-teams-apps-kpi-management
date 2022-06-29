import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, ButtonProps, EditIcon, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectGoal } from '../../goalSelectors';

const ViewGoalBtn = (props: { id: string | number } & ButtonProps): JSX.Element => {
   const { id, ...otherProps } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectGoal);

   const handleCallback = async (result: any) => {
      const _dialogResult = result as {action: string, additionalInfo: any};
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         // trigger(selectedCurrentEmployee.id);
      } else {
         console.log("DONT REFRESH");
      }
   }

   return (
      <TaskModuleButton
         title={`${t(`modal.myGoals.goal.headerAction`, { action: t(`common:button.view`) })}`}
         path={`me/goal/view/${id}`}
         content={`${t('common:button.viewProperty', { property: t('common:general.details') })}`}
         {...otherProps}
      // onClick={handleOnClick}
      />
   );
}

export default ViewGoalBtn;