import './OverviewPage.scss';

import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Loader, Text } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { abrie } from '../../../common/mockData/mockUsers';
import { IApproverModel } from '../../../common/types/approver';
import { IUserModel } from '../../../common/types/user';
import BreadcrumbNav from '../../../components/common/BreadcrumbNav';
import GoalBatch from '../../../features/goalsOld/parts/GoalBatch';
import { IGoalModel } from '../../../features/goalsOld/types';
// import KeyResultAreaContextNav from '../../../features/keyResultAreas/parts/contextNav/KraContextNav';
import UsersBar from '../../../features/user/parts/UsersBar';
import { useGetUserQuery } from '../../../features/user/userService';
import { RootState, useTypedSelector } from '../../../store';

// import UsersBar from './UsersBar';

const OverviewPage = (props: { isLoading: boolean, items: IGoalModel[], user: Partial<IUserModel> }): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { view } = useParams<{ view: string }>();
   let defaultActiveKeyResultAreaId = useTypedSelector((state: RootState) => state.keyResultArea.itemId);
   const selectedKeyResultAreas = useTypedSelector((state: RootState) => state.keyResultArea.list);
   const { isLoading, items, user } = props;

   //TODO: REPLACE MOCKDATA
   const hrManager = abrie;

   const { data: dataGetUser, error, isLoading: isLoadingGetUser, isFetching, refetch } = useGetUserQuery(user.upn || skipToken);
   let users: Partial<IUserModel[] | any> = dataGetUser ? [hrManager, ...dataGetUser!.managers] : [hrManager];
   let allApprovers = users.map((x: IUserModel, i: number) => ({
      ...x,
      level: i + 1,
      outcome: '',
      comments: '',
      approverUPN: x.upn
   })) as IApproverModel[];
   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            <Flex fill column gap={'gap.small'} className={`mmt-goalsOverview-container`}>
               <Row className='mmt-rowGutter-10'>
                  <Col>
                     <BreadcrumbNav currentNode={user.title!} />
                  </Col>
               </Row>
               <Row className='mmt-rowGutter-10 mmt-goalBatchBg'>
                  <Col xl={2} lg={2} md={2} sm={12} className="gx-0">
                     {/* <KeyResultAreaContextNav items={selectedKeyResultAreas} /> */}
                  </Col>
                  <Col key='goalsApprovalStatusBar-row' xl={10} lg={10} md={10} sm={12} className="gx-5 mmt-col-content mmt-col-goalBatchOverview-content">
                     <Text content={'Please review and approve the following ratings for the period'} />
                     <Flex className='mmt-goalsApprovalStatusBar mmt-rowGutter-10'>
                        {/* <UsersBar users={allApprovers} isLoading={isLoadingGetUser} /> */}
                        <UsersBar userUPNs={users.map((x: IUserModel) => x.upn)} />
                     </Flex>
                     <Flex fill column gap={'gap.medium'} className=''>
                        <GoalBatch isLoading={false} items={items} approvers={allApprovers} selectedKeyResultAreaId={defaultActiveKeyResultAreaId.toString()} />
                     </Flex>
                  </Col>
               </Row>
            </Flex>
         </>
      )}
      </>
   );
}

export default OverviewPage;