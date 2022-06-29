import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import Goal from '../../Goal';
import { useGetGoalQuery } from '../../goalService';
import { sliceChanged } from '../../goalSlice';
import { newGoal } from '../../types';

const GoalForm = (props: { displayMode?: string, id?: number }): JSX.Element => {
   const { id } = props;
   const displayMode = props.displayMode || 'view';
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   const [searchParams, setSearchParams] = useSearchParams();
   const batchId = searchParams.get("batchId") !== null ? parseInt(searchParams.get("batchId") as string) : 0;

   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   const { data: dataGetGoal, isFetching: isFetchingGetGoal, isLoading: isLoadingGetGoal }
      = useGetGoalQuery(id || skipToken);

   const newGoalBatchItem = { ...newGoal, batchId: batchId, userId: selectedCurrentEmployee.id }
   // Init Item
   useEffect(() => {
      dispatch(sliceChanged({ item: dataGetGoal || newGoalBatchItem, formState: displayMode }));
   }, [dataGetGoal]);

   const item = dataGetGoal || newGoalBatchItem;
   const isLoading = isLoadingGetGoal || isFetchingGetGoal || selectedCurrentEmployee.id === 0;
   return (
      <Flex gap='gap.small' padding="padding.medium" column fill className='mmt-taskModule-headerAndBody'>
         <Flex gap='gap.small' column className='mmt-taskModule-header'>
            <Flex column fill >
               <Text content={`${t('modal.myGoals.goal.title')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <Text content={`${t('modal.myGoals.goal.description')}`} size="small" />
         </Flex>
         {isLoading ? <Loader message={t('entity.goal', { count: 1 })} />
            :
            <Goal
               displayMode={displayMode as any}
               item={item}
            />
         }
      </Flex>
   );
}

export default GoalForm;