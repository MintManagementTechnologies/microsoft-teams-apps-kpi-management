
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { AddIcon, Button, ButtonProps, Flex } from '@fluentui/react-northstar';
// import { calendar } from '@microsoft/teams-js';
import * as microsoftTeams from '@microsoft/teams-js';

import {
    createGroupChatDeeplink, createMeetingDeeplink
} from '../../../../common/helpers/teamsHelpers';
import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { IAppraisalGoalReviewModel } from '../../types';

const SubmitAppraisalReviewBtn = (props: { usersUPN: string[] } & ButtonProps): JSX.Element => {
   const { usersUPN, ...otherProps } = props;
   const { t } = useTranslation();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const selectedAppraisal = useTypedSelector((state: RootState) => state.appraisal.item);

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

   // const handleOnSelfReviewSubmit = async (_event: any) => {

   // }

   const reviewLevel = selectedAppraisal ? selectedAppraisal.currentLevel : -1;
   const id = selectedAppraisal ? selectedAppraisal.id : -1;
   const action = reviewLevel === 0 ? 'submit' : 'approve';
   const entity = 'appraisal';
   return (
      <Flex>
         {/* {reviewLevel === 0 && <Button content={t('common:button.submit')} primary onClick={handleOnSelfReviewSubmit} {...otherProps} />} */}
         {/* {reviewLevel > 0 && */}
            <TaskModuleButton
               title={`${t(`modal.myAppraisals.${action}.headerAction`, { action: t(`common:button.submit`) })}`}
               path={`me/${entity.toLowerCase()}/${action}/${id}?lvl=${reviewLevel}`}
               content={`${t(`common:button.submit`)}`}
               primary
               callback={handleCallback}
               {...otherProps}
            />
         {/* } */}
      </Flex>
   );
}

export default SubmitAppraisalReviewBtn;