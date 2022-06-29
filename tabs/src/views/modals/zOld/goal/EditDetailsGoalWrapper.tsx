import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Loader, Text } from '@fluentui/react-northstar';

import mockGoals from '../../../../common/mockData/mockGoals';
import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import { IGoalModel } from '../../../../features/goalsOld/types';
import GoalForm from './GoalForm';

const EditDetailsGoalWrapper = (): JSX.Element => {
   const { t } = useTranslation();
   const { action, id } = useParams();

   const onEdit = async (_newGoal: Partial<IGoalModel>) => {

   }

   let singleItem: IGoalModel = mockGoals[0];

   return (
      <>
         <Flex gap='gap.small' column fill className='mmt-taskModule-header'>
            <Flex column fill >
               <Text content={`${t('formHeader-editGoalTitle')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(singleItem.createdTimestamp)}`} timestamp size="medium" />
            </Flex>
            <Text content={`${t('formHeader-editGoalDescription')}`} size="large" className="mmt-normalText" />
         </Flex>
         <GoalForm
            crudOperation={action as any}
            goal={singleItem}
            isLoading={false}
            onSubmit={onEdit} />
      </>
   );
}

export default EditDetailsGoalWrapper;