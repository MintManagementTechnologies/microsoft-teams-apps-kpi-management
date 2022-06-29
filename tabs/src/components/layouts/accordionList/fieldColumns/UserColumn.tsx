import * as React from 'react';
import { TableCell, Avatar, Flex, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';
import { IUserModel } from '../../../../common/types/user';

export const headerUser: IHeader = {
   headerDisplayName: 'User',
   maxWidth: '300px',
   fieldInternalName: 'userUPN',
};

export const headerManager1: IHeader = {
   headerDisplayName: 'Line Manager 1',
   maxWidth: '300px',
   fieldInternalName: 'manager-1',
};

export const headerManager2: IHeader = {
   headerDisplayName: 'Line Manager 2',
   maxWidth: '300px',
   fieldInternalName: 'manager-2',
};

const UserColumn = (props: { id: string, user: Partial<IUserModel>, size?: "smaller" | "small" | "medium" | "large" }): JSX.Element => {
   const { id, size } = props;
   if (!props.user) {
      console.log('props.user');
      console.log(props.user);
      return (
         <TableCell
            className={`mmt-tableCell-content mmt-cell-${headerUser.fieldInternalName}`}
            key={`col-${headerUser.fieldInternalName}-${id}`}
            content={
               <Flex gap="gap.small" vAlign="center">
               </Flex>
            }
            styles={{
               maxWidth: headerUser.maxWidth,
               //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
            }}
         />)
   }
   let user = {
      displayName: props.user.title,
      image: '',
      availability: 'PresenceUnknown'
   };
   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerUser.fieldInternalName}`}
         key={`col-${headerUser.fieldInternalName}-${id}`}
         content={
            <Flex gap="gap.small" vAlign="center">
               <Avatar image={user.image} name={user.displayName} size={size || "smaller"} />
               <Text content={`${user.displayName}`} />
            </Flex>
         }
         styles={{
            maxWidth: headerUser.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default UserColumn;