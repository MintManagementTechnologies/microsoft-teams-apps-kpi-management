import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, ButtonProps, EditIcon, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { selectGoal, selectTotalGoalsWeight } from '../../goalSelectors';
import { useLazyGetGoalsByEmployeeQuery } from '../../goalService';
import { listChanged } from '../../goalSlice';

const EditGoalBtn = (props: { id: string | number } & ButtonProps): JSX.Element => {
   const { id, ...otherProps } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useTypedSelector((state: RootState) => state.goal.list.find(goal => goal.id === id));
   const selectedTotalGoalsWeight = useSelector(selectTotalGoalsWeight);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   const [trigger, { data }] = useLazyGetGoalsByEmployeeQuery();

   useEffect(() => {
      if (!data) return;
      dispatch(listChanged(data));
   }, [data]);

   const handleCallback = async (result: any) => {
      const _dialogResult = result as {action: string, additionalInfo: any};
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         trigger(selectedCurrentEmployee.id);
      } else {
         console.log("DONT REFRESH");
      }
   }

   const totalWeightRemaining = 100 - selectedTotalGoalsWeight + (selectedItemState ? selectedItemState.weight : 0);
   return (
      <TaskModuleButton
         title={`${t(`modal.myGoals.goal.headerAction`, { action: t(`common:button.edit`) })}`}
         path={`me/goal/edit/${id}?weightRemaining=${totalWeightRemaining}`}
         content={`${t(`common:button.edit`)}`}
         callback={handleCallback}
         {...otherProps}
      />
   );
}

export default EditGoalBtn;