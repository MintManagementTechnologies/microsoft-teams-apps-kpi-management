import { useEffect, useState } from 'react';

import { Avatar, Flex, Loader, Pill, PillProps, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { IUserModel } from '../../common/types/user';
import { defaultAvatar } from '../../common/utils/commonVariables';
import { stringToHslColor } from '../../common/utils/sharedFunctions';
import {
    useGetUserWithPhotoAndPresenceQuery, useLazyGetUserQuery
} from '../../services/graphApiService';

const ViewUser = (props: { userId: string, showJobTitle?: boolean, title?: string, jobTitle?: string } & PillProps): JSX.Element => {
   const { userId, showJobTitle, title, jobTitle, image, ...otherProps } = props;
   const queryGraph = !(title && image) && userId && userId.length > 0;
   const [graphUserDetails, setGraphUserDetails] = useState<IUserModel>();

   const { data: dataGetUserWithPhoto, isLoading: isLoadingGetUserWithPhoto, isFetching: isFetchingGetUserWithPhoto, isError, error } = useGetUserWithPhotoAndPresenceQuery(queryGraph ? userId : skipToken);
   const [triggerGetUser,
      { data: dataGetUser, isFetching: isFetchingGetUser, isLoading: isLoadingGetUser }]
      = useLazyGetUserQuery();

      useEffect(() => {
         if(isError && !dataGetUser){
            if((error as any).error.toLowerCase().includes('imagenotfound')){
               console.error('ImageNotFoundException');
               triggerGetUser(userId);
            }
            return;
         }
         if(dataGetUserWithPhoto){
            setGraphUserDetails(dataGetUserWithPhoto)
         } else if(dataGetUser) {
            setGraphUserDetails(dataGetUser)
         }
   
      }, [dataGetUserWithPhoto, dataGetUser, isError])

   const isLoading = isLoadingGetUserWithPhoto || isFetchingGetUserWithPhoto || isLoadingGetUser || isFetchingGetUser;
   if (isLoading)
      return <Loader size={"smallest"} />;
   if (!graphUserDetails && !title)
      return <Pill className="mmt-userPill" image={defaultAvatar} size="small" disabled={otherProps.disabled}>error</Pill>;

   const userDisplayName = graphUserDetails ? graphUserDetails.title : `${title}`;
   const userAvatar = graphUserDetails ? graphUserDetails.image : image;
   const userJobTitle = dataGetUser ? dataGetUser.jobTitle : `${jobTitle}`;

   const avatarColors = stringToHslColor(userDisplayName);

   return (
      <Flex gap='gap.smaller' vAlign="center">
         <Avatar name={userDisplayName} size={otherProps.size}
            image={userAvatar}
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
         <Flex column vAlign="center">
            <Text className="mmt-label mmt-themeColorOverride" content={userDisplayName} truncated />
            {showJobTitle &&
               <Text className="mmt-content mmt-themeColorOverride" content={userJobTitle} size="small" truncated />
            }
         </Flex>
      </Flex>
   );
}

export default ViewUser;