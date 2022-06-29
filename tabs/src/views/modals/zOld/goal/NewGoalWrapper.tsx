import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';

import mockGoals from '../../../../common/mockData/mockGoals';
import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import { IGoalModel, newGoal } from '../../../../features/goalsOld/types';
import GoalForm from './GoalForm';

const NewGoalWrapper = (): JSX.Element => {
   const { t } = useTranslation();
   const onCreate = async (_newGoal: Partial<IGoalModel>) => {

   }

   let singleItem: IGoalModel = newGoal;

   return (
      <>
         <Flex gap='gap.small' column fill className='mmt-taskModule-header'>
            <Flex column fill >
               <Text content={`${t('modal.myGoals.new.title')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <Text content={`${t('modal.myGoals.new.description')}`} size="small" />
         </Flex>
         <GoalForm
            goal={singleItem}
            isLoading={false}
            onSubmit={onCreate} />
      </>
   );
}

export default NewGoalWrapper;