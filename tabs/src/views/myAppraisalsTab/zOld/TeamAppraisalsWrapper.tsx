import * as React from 'react';

import mockUsers from '../../../common/mockData/mockUsers';
import { IAppraisalModel } from '../../../common/types/appraisal';
import { headerBlank } from '../../../components/layouts/accordionList/fieldColumns/DefaultColumn';
import {
    headerItemActions
} from '../../../components/layouts/accordionList/fieldColumns/ItemActionsColumn';
import {
    headerPriority
} from '../../../components/layouts/accordionList/fieldColumns/PriorityColumn';
import { headerStatus } from '../../../components/layouts/accordionList/fieldColumns/StatusColumn';
import { headerTitle } from '../../../components/layouts/accordionList/fieldColumns/TitleColumn';
import {
    headerManager1, headerManager2, headerUser
} from '../../../components/layouts/accordionList/fieldColumns/UserColumn';
import { headerWeight } from '../../../components/layouts/accordionList/fieldColumns/WeightColumn';
import {
    groupByAppraisalUser, groupByYear
} from '../../../components/layouts/accordionList/schemas';
import { useGetAllMyEmployeesAppraisalsQuery } from '../../../services/appraisalService';
import { RootState, useTypedSelector } from '../../../store';
import BrowseAppraisals from '../../shared/zOld/BrowseAppraisals';

const TeamAppraisalsWrapper = (props: {currentUserUPN: string} ): JSX.Element => {
   const { currentUserUPN } = props;

   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectedFilters = useTypedSelector((state: RootState) => state.filters.popupFilters);
   const selectedDateRangeFilter = useTypedSelector((state: RootState) => state.filters.dateRange);
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);
   
   const { data, error, isLoading, isFetching, refetch } = useGetAllMyEmployeesAppraisalsQuery(currentUserUPN);
   let items: IAppraisalModel[] = data || [];
   items = items.map(x => ({
      ...x,
      user: {
         ...mockUsers!.find(y => (y.upn === x.creatorUPN)),
         status: x.status
      },
      appraisalYear: new Date(x.createdTimestamp).getFullYear(),
      _actions: ["AppraisalOverview"]
   }));
   const groupByFields = [groupByYear, groupByAppraisalUser];

   return (
      <BrowseAppraisals items={items} isLoading={isLoading || isFetching} groupByFields={groupByFields} />
   );
}

export default TeamAppraisalsWrapper;