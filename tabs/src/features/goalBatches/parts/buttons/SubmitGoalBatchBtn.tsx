
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { AddIcon, ButtonProps, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectGoalBatch } from '../../goalBatchSelectors';

const SubmitGoalBatchBtn = (props: {} & ButtonProps): JSX.Element => {
   const { ...otherProps } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   // const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedItemState = useSelector(selectGoalBatch);

   const handleCallback = async (result: any) => {
      const _dialogResult = result as {action: string, additionalInfo: any};
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         // trigger(selectedWorkGrade);
      } else {
         console.log("DONT REFRESH");
      }
   }

   const id = selectedItemState ? selectedItemState.id : -1;
   const entity = 'goalBatch';
   return (
      <Flex>
         <TaskModuleButton
            title={`${t(`modal.myGoals.${entity}.headerAction`, {action: t(`common:button.submit`)})}`}
            path={`me/${entity.toLowerCase()}/submit/${id}`}
            content={`${t(`button.goal.submitBatch`)}`}
            icon={<AddIcon />}
            primary
            callback={handleCallback}
            {...otherProps}
         />
      </Flex>
   );
}

export default SubmitGoalBatchBtn;