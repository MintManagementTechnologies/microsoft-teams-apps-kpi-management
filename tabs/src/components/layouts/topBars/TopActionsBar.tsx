import './TopBars.scss';

import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { AddIcon, Button, Flex, Segment, StarIcon, Text } from '@fluentui/react-northstar';
import { ErrorCode, ErrorWithCode, IdentityType, TeamsFx } from '@microsoft/teamsfx';

import { defaultAvatar } from '../../../common/utils/commonVariables';
import { getRouteParams } from '../../../common/utils/sharedFunctions';
import {
    useLazyGetEmployeeByIdQuery, useLazyGetEmployeeManagersQuery
} from '../../../features/employees/employeeService';
import Filters from '../../../features/filters/parts/popupFilters/Filters';
import SearchBox from '../../../features/filters/parts/searchBox/SearchBox';
import SubmitGoalBatchBtn from '../../../features/goalBatches/parts/buttons/SubmitGoalBatchBtn';
import { selectTotalGoalsWeight } from '../../../features/goals/goalSelectors';
import NewGoalBtn from '../../../features/goals/parts/buttons/NewGoalBtn';
import {
    useLazyGetMultipleUsersWithPhotoAndPresenceQuery
} from '../../../services/graphApiService';
import {
    INotificationData, useNotifyEmployeeMutation, useNotifyMutation
} from '../../../services/notificationService';
import { RootState, useTypedSelector } from '../../../store';
import CommandButton from '../../commands/CommandButton';
import { getSingleCommand } from '../../commands/commands';
import AllAppraisalsAction from '../../commands/uiActions/hrAdmin/allAppraisals';
import AllGoalsAction from '../../commands/uiActions/hrAdmin/allGoals';
import AllSettingsAction from '../../commands/uiActions/hrAdmin/allSettings';
import LinkButton from '../../common/buttons/LinkButton';
import LayoutToggle from '../../common/layoutToggle/LayoutToggle';
import UserscopeViewToggle from '../../common/userscopeViewToggle/UserscopeViewToggle';
import UserSwitchDropdown from '../../common/userSwitch/UserSwitchDropdown';

const TopActionsBar = (props: { loading: boolean }): JSX.Element => {
   const { t } = useTranslation();
   const { pathname } = useLocation();
   const { loading } = props;
   const {
      userScope,
      view,
      action,
      id
   } = getRouteParams(pathname);


   const loggedInUserId = useTypedSelector((state: RootState) => state.currentUser.id);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedTotalGoalsWeight = useSelector(selectTotalGoalsWeight);

   const isHRuserScope = (userScope === 'hr');
   const isMyGoalsTab = (view === 'mygoals') && (userScope !== 'hr');
   const isMyAppraisalsTab = (view === 'myappraisals') && (userScope !== 'hr');
   const isAllGoalsView = (view === 'mygoals') && (userScope === 'hr');
   const isAllAppraisalsView = (view === 'myappraisals') && (userScope === 'hr');
   const isSettingsView = (view === 'settings');
   const isBrowseAction = (action.includes('browse'));

   const allGoalsBtn = new AllGoalsAction('topBar');
   const allAppraisalsBtn = new AllAppraisalsAction('topBar');
   const allSettingsBtn = new AllSettingsAction('topBar');

   // const [triggerGetEmployeeById,
   //    { data: dataGetEmployeeById, isFetching: isFetchingGetEmployeeById, isLoading: isLoadingGetEmployeeById }]
   //    = useLazyGetEmployeeByIdQuery();

   const [triggerNotifyEmployee,
      { data: dataNotifyEmployee, isLoading: isLoadingNotifyEmployee }]
      = useNotifyEmployeeMutation();

   // useEffect(() => {
   //    triggerGetEmployeeById(105);
   // }, []);

   // useEffect(() => {
   //    if (!dataGetEmployeeById) return;
      // triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
   // }, [dataGetEmployeeById]);


   const [approvers, setApprovers] = useState<{
      order: number;
      displayName: string;
      image: string;
   }[]>([]);
   // const [triggerGetMultipleUsersWithPhotoAndPresence,
   //    { data: dataGetMultipleUsersWithPhotoAndPresence, isFetching: isFetchingGetMultipleUsersWithPhotoAndPresence, isLoading: isLoadingGetMultipleUsersWithPhotoAndPresence }]
   //    = useLazyGetMultipleUsersWithPhotoAndPresenceQuery();

   // useEffect(() => {
   //    if (!dataGetEmployeeManagers || dataGetEmployeeManagers.length === 0 || approvers.length > 0 || dataGetEmployeeById?.id === 0) return;
   //    setApprovers(dataGetEmployeeManagers.map((x, i) => ({
   //       order: i + 1,
   //       displayName: x.title,
   //       image: x.image || defaultAvatar,
   //    })));
      // let isEmptyUPN = false;
      // managersUPN.forEach(x => {
      //    if (x === null || x === '') { isEmptyUPN = true; }
      // })
      // if (isEmptyUPN) return;
      // triggerGetMultipleUsersWithPhotoAndPresence(dataGetEmployeeManagers.map(x => x.upn));
   // }, [dataGetEmployeeManagers]);

   // useEffect(() => {
   //    if (!dataGetMultipleUsersWithPhotoAndPresence || dataGetMultipleUsersWithPhotoAndPresence.length === 0) return;
   //    setApprovers(dataGetMultipleUsersWithPhotoAndPresence.map((x, i) => ({
   //       order: i + 1,
   //       displayName: x.title,
   //       image: x.image || defaultAvatar,
   //    })));
   // }, [dataGetMultipleUsersWithPhotoAndPresence]);


   const onNotify = (_event: any) => {
      if (_event !== null) _event.preventDefault();

      const notification: INotificationData = {
         recipients: [loggedInUserId],
         cardData: {
            url: "https://teams.microsoft.com/l/entity/f21cf063-4b7a-457e-8e39-815ad2ec5687/mygoals",
            title: 'Your goals have been submitted for approval',
            subtitle: 'Your line manager(s) will contact you for any queries',
            approvers: approvers
         }
      }
      triggerNotifyEmployee(notification)
   }

   return (
      <Row key='topActionsBar-row' className='mmt-topActionsBar'>
         {loading ? (
            <Col key='topActionsBar-col-loading'>
               <Flex hAlign='center'>
                  <Text content={' '} />
               </Flex>
            </Col>
         ) :
            (<>
               <Col xl={6} lg={6} md={6} sm={12} key='topActionsBar-col-newBtn' className='gx-5'>
                  {isHRuserScope &&
                     <Flex fill gap='gap.medium'>
                        <LinkButton icon={<StarIcon />} primary={isAllGoalsView && (view === 'mygoals')}
                           path={`hr/mygoals/browse/1`}
                           content={`${t(`button.hr.allGoals`)}`}
                        />
                        <LinkButton icon={<StarIcon />} primary={isAllAppraisalsView && (view === 'myappraisals')}
                           path={`hr/myappraisals/browse/1`}
                           content={`${t(`button.hr.allAppraisals`)}`}
                        />
                        <LinkButton icon={<StarIcon />} primary={isSettingsView}
                           path={`hr/settings/krabrowse/1`}
                           content={`${t(`button.hr.settings`)}`}
                        />
                     </Flex>
                  }
                  {isMyAppraisalsTab &&
                     <Flex fill gap='gap.medium'>
                        <UserscopeViewToggle isDisabled={!isBrowseAction} />
                     </Flex>
                  }
                  {isMyGoalsTab &&
                     <Flex fill gap='gap.medium'>
                        <UserscopeViewToggle isDisabled={!isBrowseAction} />
                        {userScope === 'me' && isBrowseAction && <>
                           <NewGoalBtn batchId={selectedGoalBatch ? selectedGoalBatch.id : 0}
                              disabled={!(selectedGoalBatch && selectedGoalBatch.id > 0 && selectedAppraisalPeriod.active && selectedTotalGoalsWeight < 100)} />
                           {selectedGoalBatch &&
                              <SubmitGoalBatchBtn disabled={selectedTotalGoalsWeight < 100 || !selectedAppraisalPeriod.active || selectedGoalBatch.status !== 'draft'} />
                           }
                        </>}
                        {/* <Button
                           content={`Test notify`}
                           icon={<AddIcon />}
                           primary
                           onClick={onNotify}
                        /> */}
                     </Flex>
                  }
               </Col>
               <Col className='mmt-topActionsBar-col' xl={3} lg={3} md={6} sm={12} key='topActionsBar-col-layoutToggle'>
                  <Flex fill hAlign='end' gap='gap.small'>
                  </Flex>
               </Col>
               <Col className='mmt-topActionsBar-col' xl={3} lg={3} md={12} sm={12} key='topActionsBar-col-search'>
                  <Flex fill hAlign='end' gap='gap.small'>
                     {userScope === 'me' && isMyGoalsTab &&
                        <LayoutToggle />
                     }
                     {/* <Filters disabled={!isBrowseAction} /> */}
                     {/* <SearchBox disabled={!isBrowseAction} /> */}
                  </Flex>
               </Col>
            </>)}
      </Row>
   );
}

export default TopActionsBar;