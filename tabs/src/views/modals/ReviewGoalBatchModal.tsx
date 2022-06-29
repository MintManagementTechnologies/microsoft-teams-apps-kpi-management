import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import { getLocaleDate, upperFirstLetter } from '../../common/utils/sharedFunctions';
import ReviewGoalBatchForm from '../../features/goalBatches/parts/forms/ReviewGoalBatchForm';

export interface IApprovalOutcome {
   comments: string;
   outcome: 'approve' | 'reject' | string;
   startConversation: boolean;
   initiateMeeting: boolean;
}
const ReviewGoalBatchModal = (props: { id: number, userId: number }): JSX.Element => {
   const { id,userId } = props;
   // const id = 928;
   // const userId = 106;
   const { t } = useTranslation();
   let [searchParams, setSearchParams] = useSearchParams();
   const totalRequiresReview = searchParams.get("reqRev");
   const outcome = totalRequiresReview ? 'reject' : 'approve';

   const getDescriptionText = () => {
      let baseDescriptionText = t(`modal.myGoals.approve.description.${outcome}`);
      if (outcome === 'approve') {
         return <>{baseDescriptionText}</>;
      }
      return (
         <>
            <Text content={totalRequiresReview} size="large" weight="bold" color={'brand'} />
            {baseDescriptionText}
         </>
      );
   }

   return (
      <>
         <Flex gap='gap.small' padding="padding.medium" column fill className='mmt-taskModule-headerAndBody'>
            <Flex column>
               <Text content={`${t('modal.myGoals.approve.title', { outcome: upperFirstLetter(outcome) })}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <Flex vAlign='end'>
               <Text content={getDescriptionText()} size="small" />
            </Flex>
            <ReviewGoalBatchForm defaultOutcome={outcome} id={id} currentApproverId={userId} />
         </Flex>
      </>
   );
}

export default ReviewGoalBatchModal;