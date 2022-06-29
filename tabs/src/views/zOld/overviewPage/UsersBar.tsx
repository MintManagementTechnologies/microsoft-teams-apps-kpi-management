import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Flex, Loader, Pill, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { abrie } from '../../../common/mockData/mockUsers';
import { IApproverModel } from '../../../common/types/approver';
import { IUserModel } from '../../../common/types/user';
import { getRouteParams } from '../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../components/common/ErrorMessage';
import UserCard from '../../../components/common/UserCard';
import { IGoalModel } from '../../../features/goalsOld/types';
import { useGetUserQuery } from '../../../features/user/userService';

const UsersBar = (props: { users: IApproverModel[], isLoading: boolean }): JSX.Element => {
   const { t } = useTranslation();
   const { pathname } = useLocation();
   const { users, isLoading } = props;
   const { id } = getRouteParams(pathname);   
   let goalUsers: Partial<IUserModel[] | any> = users || [];
   

   if (goalUsers.length === 0) {
      return (
         <ErrorMessage message={t('error.users.empty')} messageDetails={`UsersBar: No managers found for the user`}>
            {/* <Text content={`currentUserUPN: ${props.currentUserUPN}`} /> */}
         </ErrorMessage>
      )
   }
   
   return (
      <>
         {isLoading ? (
            <Row key='goalsApprovalStatusBar-row-loading'>
               <Col key='goalsApprovalStatusBar-col-loading'>
                  <Flex hAlign='center'>
                     <Loader label={`${t('common:loading', {entity: "Users"})}`} />
                  </Flex>
               </Col>
            </Row>
         ) : (
            <>
               {(goalUsers).map((x:IUserModel, i:number) => (
                  < Col key={`goalsApprovalStatusBar-col-user-${i}`} >
                     <Flex fill vAlign='center' className={`mmt-userRole-container`} gap='gap.medium'>
                        <Pill className={`mmt-statusPill userRole`}>
                           {i===0 ?
                              <Text content={t('common:userRole.createdBy')} />
                              :
                              <Text content={`${t('common:userRole.manager')} ${i}`} />
                           }
                        </Pill>
                        <UserCard size='small' user={{
                           displayName: x.title,
                           jobTitle: x.jobTitle,
                           email: x.upn,
                           presence: 'available'
                        }} />
                     </Flex>
                  </Col>)
               )}
            </>
         )
         }
      </>
   );
}

export default UsersBar;