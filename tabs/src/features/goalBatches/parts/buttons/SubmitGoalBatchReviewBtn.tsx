
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ButtonProps, Flex } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import {
    createGroupChatDeeplink, createMeetingDeeplink
} from '../../../../common/helpers/teamsHelpers';
import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { RootState, useTypedSelector } from '../../../../store';
import { selectGoalBatch } from '../../goalBatchSelectors';

const SubmitGoalBatchReviewBtn = (props: { usersUPN: string[] } & ButtonProps): JSX.Element => {
   const { usersUPN, ...otherProps } = props;
   const { t } = useTranslation();
   const navigate = useNavigate();

   const selectedItemState = useSelector(selectGoalBatch);
   const selectedGoalBatchResult
      = useTypedSelector((state: RootState) => state.goalBatch.formResult) as { kraTitle: string, kraId: number, goalId: number, approved: boolean }[];

   const handleCallback = async (result: any) => {
      const _dialogResult = result as { action: string, additionalInfo: any };
      const { action, additionalInfo } = _dialogResult;
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         if (additionalInfo.toLowerCase().includes('meeting')) {
            const deeplink = createMeetingDeeplink(usersUPN);
            microsoftTeams.executeDeepLink(deeplink);
         } else if (additionalInfo.toLowerCase().includes('groupchat')) {
            const deeplink = createGroupChatDeeplink(usersUPN);
            microsoftTeams.executeDeepLink(deeplink);
         } else {
            navigate(-1);
         }
      } else {
         console.log("DONT REFRESH");
      }
   }


   const id = selectedItemState ? selectedItemState.id : -1;
   const totalRequiresReview = selectedGoalBatchResult ? selectedGoalBatchResult.filter(x => !x.approved).length : 0;
   const reqReviewQueryParam = totalRequiresReview ? `reqRev=${totalRequiresReview}` : '';
   const outcome = totalRequiresReview ? `reject` : 'approve';
   const entity = 'goalBatch';
   return (
      <Flex>
         <TaskModuleButton
            title={`${t(`modal.myGoals.${entity}.headerAction`, { action: t(`common:button.${outcome}`) })}`}
            path={`me/${entity.toLowerCase()}/approve/${id}?${reqReviewQueryParam}`}
            content={`${t(`common:button.submit`)}`}
            primary
            callback={handleCallback}
            {...otherProps}
         />
      </Flex>
   );
}

export default SubmitGoalBatchReviewBtn;