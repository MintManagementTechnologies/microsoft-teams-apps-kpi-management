import * as React from 'react';

import mockUsers from '../../../common/mockData/mockUsers';
import { groupByKRA, groupByUser } from '../../../components/layouts/accordionList/schemas';
import { useGetAllMyEmployeesGoalsOldQuery } from '../../../features/goalsOld/goalService';
import { IGoalModel } from '../../../features/goalsOld/types';
import { RootState, useTypedSelector } from '../../../store';
import BrowseGoals from '../../shared/zOld/BrowseGoals';

const TeamGoalsWrapper = (props: {currentUserUPN: string} ): JSX.Element => {
   const { currentUserUPN } = props;

   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectedFilters = useTypedSelector((state: RootState) => state.filters.popupFilters);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   // const selectedDateRangeFilter = useTypedSelector((state: RootState) => state.filters.dateRange);
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);
   
   const { data, error, isLoading, isFetching, refetch } = useGetAllMyEmployeesGoalsOldQuery(currentUserUPN);
   let items: IGoalModel[] = data || [];
   items = items.map(x => ({
      ...x,
      user: {
         ...mockUsers!.find(y => (y.upn === x.userUPN)),
         status: x.status,
         batchStatus: x.batchStatus,
         batchTotalLevels: x.batchTotalLevels,
         batchCurrentLevel: x.batchCurrentLevel,
         _actions: ["GoalsOverview", "GoalConversation", "GoalMeeting"]
      },
      _actions: ["ViewGoal", "GoalConversation", "GoalMeeting"],
      _footerActions: ["ViewGoal"]
   }));
   const groupByFields = [groupByKRA, groupByUser];
   const layout = 'list';

   return (
      <BrowseGoals items={items} isLoading={isLoading || isFetching} layout={layout} groupByFields={groupByFields} />
   );
}

export default TeamGoalsWrapper;