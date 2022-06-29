import { useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import mockUsers from '../../../common/mockData/mockUsers';
import { IAppraisalModel } from '../../../common/types/appraisal';
import { distinct } from '../../../common/utils/sharedFunctions';
import { groupByKRA, myGoalsHeader } from '../../../components/layouts/accordionList/schemas';
import {
    useGetAllKeyResultAreasQuery
} from '../../../features/keyResultAreas/keyResultAreaService';
import { IKeyResultAreaModel } from '../../../features/keyResultAreas/types';
import { useGetAllUserAppraisalsQuery } from '../../../services/appraisalService';
import { RootState, useAppDispatch, useTypedSelector } from '../../../store';
import BrowseAppraisals from '../../shared/zOld/BrowseAppraisals';

const MyAppraisalsWrapper = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;
   const dispatch = useAppDispatch();

   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectedFilters = useTypedSelector((state: RootState) => state.filters.popupFilters);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   // const selectedDateRangeFilter = useTypedSelector((state: RootState) => state.filters.dateRange);
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);
   const selectFilterResults = useMemo(() => {
      // Return a unique selector instance for this page so that
      // the filtered results are correctly memoized
      return createSelector(
         (res: any) => res.data,
         (data) => {
            let dataResult = data ? data as IAppraisalModel[] : undefined;

            if (dataResult && selectedAppraisalPeriod.id) {
               dataResult = dataResult.filter(x => x.appraisalPeriodId === selectedAppraisalPeriod.id.toString());
            }

            return dataResult ?
               dataResult.filter((x: IAppraisalModel) => x.title.toLowerCase().includes(searchQuery))
               : undefined
         }
      )
   }, [selectedAppraisalPeriod, searchQuery])

   //Use the same posts query, but extract only part of its data
   //eslint-disable-next-line
   const {
      filteredData,
      error: errorAllUserAppraisals,
      isLoading: isLoadingAllUserAppraisals,
      isFetching: isFetchingAllUserAppraisals,
      refetch: refetchAllUserAppraisals
   } = useGetAllUserAppraisalsQuery(currentUserUPN, {
      selectFromResult: result => {
         return ({
            ...result,
            filteredData: selectFilterResults(result)
         })
      }
   });
   let appraisalItems: IAppraisalModel[] = filteredData || [];
   appraisalItems = appraisalItems.map(x => ({
      ...x,
      // user: {
      //    ...mockUsers!.find(y => (y.upn === x.userUPN)),
      //    status: x.status,
      //    batchStatus: x.batchStatus,
      //    batchTotalLevels: x.batchTotalLevels,
      //    batchCurrentLevel: x.batchCurrentLevel
      // },
      _actions: ["AppraisalOverview"]
   }));
   // const {
   //    data: dataAllUserGoals,
   //    error: errorAllUserGoals,
   //    isLoading: isLoadingAllUserGoals,
   //    isFetching: isFetchingAllUserGoals,
   //    refetch: refetchAllUserGoals
   // } = useGetAllUserGoalsQuery(currentUserUPN);
   //let goalItems: IGoalModel[] = dataAllUserGoals || [];

   return (
      <BrowseAppraisals 
         items={appraisalItems}
         isLoading={isLoadingAllUserAppraisals || isFetchingAllUserAppraisals} />
   );
}

export default MyAppraisalsWrapper;