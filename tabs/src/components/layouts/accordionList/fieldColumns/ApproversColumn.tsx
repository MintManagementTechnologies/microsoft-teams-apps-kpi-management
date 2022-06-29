import * as React from 'react';
import { TableCell, Avatar, Flex } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerApprovers: IHeader = {
   headerDisplayName: 'Approvers',
   maxWidth: '300px',
   fieldInternalName: 'currentApproversUPN',
};

const header: IHeader = {
   headerDisplayName: 'Approver',
   maxWidth: '300px',
   fieldInternalName: 'currentApproverUPN',
};

export const headerApprover = header;

const ApproversColumn = (props: { id: string, approversUPN: string[] }): JSX.Element => {
   const { id, approversUPN } = props;

   //const { data: approvers, error: errorApprovers, isLoading: isLoadingApprovers, refetch: refetchApprovers } = useGetAllRequestApproversQuery(request.id);
   let users: any[] = [];
   let user = {
      displayName: 'Loading',
      image: '',
      availability: 'PresenceUnknown'
   };
   if (users.length > 0) {
      user = users[0]
   }

   const renderAvatars = () => {
      if (users.length === 0) return <></>;
      return <Flex fill gap="gap.smaller" vAlign="center">
         {users.map(user => <Avatar image={user.image} name={user.displayName} size="smaller" />)}
      </Flex>
   }

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${header.fieldInternalName}`}
         key={`col-${header.fieldInternalName}-${id}`}
         content={renderAvatars()}
         styles={{
            maxWidth: header.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default ApproversColumn;