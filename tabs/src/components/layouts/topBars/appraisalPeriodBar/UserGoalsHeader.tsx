import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Flex, Text } from '@fluentui/react-northstar';

import { getRouteParams } from '../../../../common/utils/sharedFunctions';
import AppraisalPeriodList from '../../../../features/appraisalPeriods/AppraisalPeriodList';
import AppraisalPeriodFilter from '../../../../features/appraisalPeriods/parts/filters/AppraisalPeriodFilter';
import { selectTotalGoalsWeight } from '../../../../features/goals/goalSelectors';
import { RootState, useTypedSelector } from '../../../../store';
import GoalBatchStatusIndicator from '../../../goal/GoalBatchStatusIndicator';

const UserGoalsHeader = (props: { loading: boolean }): JSX.Element => {
   const { pathname } = useLocation();
   const { loading } = props;
   const { action, view } = getRouteParams(pathname);
   const isBrowseAction = (action === 'browse'); // pathname.includes('browse');
   const isReviewPage = (action === 'batch'); // pathname.includes('batch');
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedTotalGoalsWeight = useSelector(selectTotalGoalsWeight);
   const { t } = useTranslation();
   let status = selectedGoalBatch ? selectedGoalBatch.status : 'inProgress';
   const isMyGoalsTab = (view === 'mygoals');

   const smallSizeClass = isReviewPage ? 'mmt-divider-only' : '';
   return (
      <>
         {(loading || isReviewPage) ? (
            <Flex hAlign='center'>
               <Text content={' '} />
            </Flex>
         ) : (
            <Row key='userGoalsHeader-row' className={`mmt-appraisalPeriodBar ${smallSizeClass}`} xl={3} lg={3} md={2} sm={1}>
               <Col key='appraisalPeriodBar-col-period' xl={3} lg={3} md={2} sm={12}>
                  {!isReviewPage && <AppraisalPeriodFilter disabled={!isBrowseAction} />}
               </Col>
               <Col key='userGoalsHeader-col-userManagers' className='mmt-userGoalsHeader gx-5' xl={4} lg={4} md={4} sm={12}>
                  <div className='mmt-userManagers-container'>
                     <Row xl={3} lg={3} md={2} sm={2}>
                        {selectedCurrentEmployee.managers.map((user, i) =>
                           <Col key={`userGoalsHeader-col-manager-${i + 1}`}>
                              <Flex gap='gap.smaller' column>
                                 <Text content={`${t('common:userRole.manager')} ${i + 1}`} className={'mmt-userGoalsHeader-label'} />
                                 <Text content={user.title} className={`mmt-lineManager-value`} />
                              </Flex>
                           </Col>
                        )}
                     </Row>
                  </div>
               </Col>
               {isMyGoalsTab &&
                  <Col key='userGoalsHeader-col-goalsStage' xl={5} lg={5} md={6} sm={12} className='mmt-userGoalsHeader'>
                     <Flex gap='gap.large' vAlign={'center'} hAlign={'end'} fill className='mmt-goalsStage-container'>
                        <GoalBatchStatusIndicator content={`${t(`entity.goal`, { count: 1 })} ${t(`common:status.ready`)}`} status={selectedTotalGoalsWeight === 100 ? 'complete' : ''} />
                        <GoalBatchStatusIndicator content={`${t(`entity.goal`, { count: 1 })} ${t(`common:status.submitted`)}`} status={(status === 'pending' || status === 'approved') ? 'complete' : ''} />
                        <GoalBatchStatusIndicator content={`${t(`entity.goal`, { count: 1 })} ${t(`common:status.approved`)}`} status={status === 'approved' ? 'complete' : ''} />
                     </Flex>
                  </Col>
               }
            </Row>
         )}
      </>
   );
}

export default UserGoalsHeader;