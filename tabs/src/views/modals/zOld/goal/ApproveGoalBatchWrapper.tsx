import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import { getLocaleDate, upperFirstLetter } from '../../../../common/utils/sharedFunctions';
import ApproveForm, { IApprovalOutcome } from '../ApproveForm';

const ApproveGoalBatchWrapper = (props: { outcome: string }): JSX.Element => {
   const { t } = useTranslation();
   let [searchParams, setSearchParams] = useSearchParams();
   const { outcome } = props;
   
   const onSubmit = async (_comments: string, _startConversation: boolean, _initiateMeeting: boolean) => {
      microsoftTeams.tasks.submitTask("refresh");
   }

   let defaultApprovalOutcome: IApprovalOutcome = {
      comments: '',
      outcome: outcome,
      startConversation: false,
      initiateMeeting: false,
   };

   const getDescriptionText = () => {
      let baseDescriptionText = t(`modal.myGoals.approve.description.${outcome}`);
      if (outcome === 'approve') {
         return <>{baseDescriptionText}</>;
      }
      let totalRequiresReview = searchParams.get("reqRev");
      return (
         <>
            <Text content={totalRequiresReview} size="large" weight="bold" color={'brand'} />
            {baseDescriptionText}
         </>
      );
   }

   return (
      <>
         <Flex gap='gap.small' column fill className='mmt-taskModule-header'>
            <Flex column fill >
               <Text content={`${t('modal.myGoals.approve.title', { outcome: upperFirstLetter(outcome) })}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <Flex fill vAlign='end'>
               <Text content={getDescriptionText()} size="small" />
            </Flex>
            <ApproveForm defaultApprovalOutcome={defaultApprovalOutcome} isLoading={false} onSubmit={onSubmit} />
         </Flex>
      </>
   );
}

export default ApproveGoalBatchWrapper;