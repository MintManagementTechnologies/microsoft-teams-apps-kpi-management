
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps, Flex } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import {
    createGroupChatDeeplink, createMeetingDeeplink
} from '../../../common/helpers/teamsHelpers';

const CollaborationButton = (props: { usersUPN: string[], action: 'meeting' | 'groupchat' } & ButtonProps): JSX.Element => {
   const { usersUPN, action, ...otherProps } = props;
   const { t } = useTranslation();

   const handleOnClick = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      if (action === 'meeting') {
         const deeplink = createMeetingDeeplink(usersUPN);
         microsoftTeams.executeDeepLink(deeplink);
      } else if (action === 'groupchat') {
         const deeplink = createGroupChatDeeplink(usersUPN);
         microsoftTeams.executeDeepLink(deeplink);
      }
   }

   return (
      <Button content={t(`common:button.${action}`)} onClick={handleOnClick} {...otherProps} text />
   );
}

export default CollaborationButton;