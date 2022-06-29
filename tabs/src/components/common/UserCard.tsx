import * as React from 'react';
import { Text, Avatar, Flex } from "@fluentui/react-northstar";
import { stringToHslColor } from '../../common/utils/sharedFunctions';

interface IUser {
   displayName: string;
   image?: string;
   jobTitle?: string;
   email?: string;
   presence?: string;
   telephoneNumber?: string;
}

const UserCard = (props: { user: IUser, type?: 'avatar' | 'basic' | 'summary' | 'detailed', size?: string }): JSX.Element => {
   const { displayName, image, jobTitle, email, presence } = props.user;
   const { type, size } = props;

   const avatarSize = size ? size : 'medium';
   const cardType = type ? type : 'basic';

   const avatarColors = stringToHslColor(displayName);

   return (
      <Flex space="between" gap='gap.smaller' vAlign="center">
         <Avatar name={displayName} size={avatarSize as any}
            image={image || undefined}
            label={{
               styles: {
                  color: avatarColors.color,
                  backgroundColor: avatarColors.backgroundColor,
               },
            }}
            status={{
               color: 'green',
               title: 'Available',
            }}
         />
         {!(cardType === 'avatar') &&
            <Flex column vAlign="center">
               <Text className="mmt-label mmt-themeColorOverride" content={displayName} truncated />
               <Text className="mmt-content mmt-themeColorOverride" content={jobTitle} size="small" truncated />
            </Flex>
         }
      </Flex>
   );
}

export default UserCard;