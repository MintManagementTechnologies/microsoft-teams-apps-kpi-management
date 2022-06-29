
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { AddIcon, ButtonProps, Flex } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { selectGoal, selectTotalGoalsWeight } from '../../goalSelectors';
import { useLazyGetGoalsByEmployeeQuery } from '../../goalService';
import { listChanged } from '../../goalSlice';

const NewGoalBtn = (props: {batchId: number} & ButtonProps): JSX.Element => {
   const { batchId, ...otherProps } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectGoal);
   const selectedTotalGoalsWeight = useSelector(selectTotalGoalsWeight);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   const [trigger, {data}] = useLazyGetGoalsByEmployeeQuery();

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

   const id = uuid();
   const entity = 'goal';
   return (
      <Flex>
         <TaskModuleButton
            title={`${t(`modal.myGoals.goal.headerAction`, {action: t(`common:button.create`)})}`}
            path={`me/goal/new/${id}?batchId=${batchId}&weightRemaining=${100-selectedTotalGoalsWeight}`}
            content={`${t(`common:button.newEntity`, { entity: t(`entity.${entity}`, { count: 1 }) })}`}
            icon={<AddIcon />}
            primary
            callback={handleCallback}
            {...otherProps}
         />
      </Flex>
   );
}

export default NewGoalBtn;