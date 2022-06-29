import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import { getLocaleDate } from '../../common/utils/sharedFunctions';
import ReviewAppraisalForm from '../../features/appraisals/parts/forms/ReviewAppraisalForm';

export interface IApprovalOutcome {
   comments: string;
   outcome: 'approve' | 'reject' | string;
   startConversation: boolean;
   initiateMeeting: boolean;
}
const ReviewAppraisalModal = (props: { id: number, userId: number }): JSX.Element => {
   const { id, userId } = props;
   // const id = 928;
   // const userId = 125;
   let [searchParams, setSearchParams] = useSearchParams();
   const currentLevelParam = searchParams.get("lvl");
   const currentLevel = currentLevelParam ? parseInt(currentLevelParam) : -1;
   const { t } = useTranslation();

   return (
      <>
         <Flex gap='gap.small' padding="padding.medium" column fill className='mmt-taskModule-headerAndBody'>
            <Flex column>
               <Text content={`${t('modal.myAppraisals.approve.title')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <ReviewAppraisalForm id={id} currentReviewerId={userId} currentLevel={currentLevel} />
         </Flex>
      </>
   );
}

export default ReviewAppraisalModal;