import * as React from 'react';
import { useParams } from 'react-router-dom';

import mockUsers from '../../common/mockData/mockUsers';
import { ITableSchema } from '../../components/layouts/accordionList/AccordionList';
import {
    headerDepartment, headerJobTitle
} from '../../components/layouts/accordionList/fieldColumns';
import { headerCreated } from '../../components/layouts/accordionList/fieldColumns/CreatedColumn';
import {
    headerBlank, headerDefault
} from '../../components/layouts/accordionList/fieldColumns/DefaultColumn';
import {
    headerItemActions
} from '../../components/layouts/accordionList/fieldColumns/ItemActionsColumn';
import { headerPriority } from '../../components/layouts/accordionList/fieldColumns/PriorityColumn';
import { headerStatus } from '../../components/layouts/accordionList/fieldColumns/StatusColumn';
import { headerTitle } from '../../components/layouts/accordionList/fieldColumns/TitleColumn';
import {
    headerManager1, headerManager2, headerUser
} from '../../components/layouts/accordionList/fieldColumns/UserColumn';
import { headerWeight } from '../../components/layouts/accordionList/fieldColumns/WeightColumn';
import {
    defaultGoalsHeader, groupByKRA, groupByUser
} from '../../components/layouts/accordionList/schemas';
import { useGetAllAppraisalPeriodGoalsOldQuery } from '../../features/goalsOld/goalService';
import { IGoalModel } from '../../features/goalsOld/types';
import { useGetAllUsersQuery } from '../../features/user/userService';
import { RootState, useTypedSelector } from '../../store';
import BrowseGoals from '../shared/zOld/BrowseGoals';

const AllGoalsWrapper = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;

   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectedFilters = useTypedSelector((state: RootState) => state.filters.popupFilters);
   // const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   // const selectedDateRangeFilter = useTypedSelector((state: RootState) => state.filters.dateRange);
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);

   const { data, error, isLoading, isFetching, refetch } = useGetAllAppraisalPeriodGoalsOldQuery('5');
   const { data: getAllUsersResult } = useGetAllUsersQuery();
   let items: IGoalModel[] = data || [];
   items = items.map(x => ({
      ...x,
      user: {
         ...mockUsers!.find(y => (y.upn === x.userUPN)),
         status: x.status,
         batchStatus: x.batchStatus,
         batchTotalLevels: x.batchTotalLevels,
         batchCurrentLevel: x.batchCurrentLevel
      }
   }));
   const groupByFields = [groupByKRA, groupByUser];
   const layout = 'list';

   const renderListSchema = (): ITableSchema[] => {
      return defaultGoalsHeader;
   }

   return (
      <BrowseGoals items={items} isLoading={isLoading || isFetching} layout={layout} groupByFields={groupByFields} schema={renderListSchema()} />
   );
}

export default AllGoalsWrapper;