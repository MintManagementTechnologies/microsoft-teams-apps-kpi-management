import { useEffect, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import mockUsers from '../../../common/mockData/mockUsers';
import { distinct } from '../../../common/utils/sharedFunctions';
import { groupByKRA, myGoalsHeader } from '../../../components/layouts/accordionList/schemas';
import { useGetAllUserGoalsOldQuery } from '../../../features/goalsOld/goalService';
import { IGoalModel } from '../../../features/goalsOld/types';
import {
    useGetAllKeyResultAreasQuery
} from '../../../features/keyResultAreas/keyResultAreaService';
import { IKeyResultAreaModel } from '../../../features/keyResultAreas/types';
// import { submitGoalSetChanged } from '../../features/validations/validationsSlice';
import { RootState, useAppDispatch, useTypedSelector } from '../../../store';
import BrowseGoals from '../../shared/zOld/BrowseGoals';

const MyGoalsWrapper = (props: { currentUserUPN: string }): JSX.Element => {
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
            let dataResult = data ? data as IGoalModel[] : undefined;

            if (dataResult && selectedAppraisalPeriod.id) {
               dataResult = dataResult.filter(x => x.appraisalPeriodId === selectedAppraisalPeriod.id.toString());
            }

            return dataResult ?
               dataResult.filter((x: IGoalModel) => x.title.toLowerCase().includes(searchQuery))
               : undefined
         }
      )
   }, [selectedAppraisalPeriod, searchQuery])

   //Use the same posts query, but extract only part of its data
   //eslint-disable-next-line
   const {
      filteredData,
      error: errorAllUserGoals,
      isLoading: isLoadingAllUserGoals,
      isFetching: isFetchingAllUserGoals,
      refetch: refetchAllUserGoals
   } = useGetAllUserGoalsOldQuery(currentUserUPN, {
      selectFromResult: result => {
         return ({
            ...result,
            filteredData: selectFilterResults(result)
         })
      }
   });
   let goalItems: IGoalModel[] = filteredData || [];
   goalItems = goalItems.map(x => ({
      ...x,
      user: {
         ...mockUsers!.find(y => (y.upn === x.userUPN)),
         status: x.status,
         batchStatus: x.batchStatus,
         batchTotalLevels: x.batchTotalLevels,
         batchCurrentLevel: x.batchCurrentLevel
      },
      _actions: ["ViewGoal", "EditGoal", "DeleteGoal"],
      _footerActions: ["ViewGoal"]
   }));
   // const {
   //    data: dataAllUserGoals,
   //    error: errorAllUserGoals,
   //    isLoading: isLoadingAllUserGoals,
   //    isFetching: isFetchingAllUserGoals,
   //    refetch: refetchAllUserGoals
   // } = useGetAllUserGoalsQuery(currentUserUPN);
   //let goalItems: IGoalModel[] = dataAllUserGoals || [];

   const {
      data: dataAllKeyResultAreas,
      error: errorAllKeyResultAreas,
      isLoading: isLoadingAllKeyResultAreas,
      isFetching: isFetchingAllKeyResultAreas,
      refetch: refetchAllKeyResultAreas
   } = useGetAllKeyResultAreasQuery();
   let kraItems: IKeyResultAreaModel[] = dataAllKeyResultAreas || [];
   const groupByFields = [groupByKRA];

   const initialValue = 0;
   const totalGoalBatchWeight = goalItems.reduce(
      (previousValue, currentItem) => previousValue + currentItem.weight,
      initialValue
   );
   const totalKeyResultAreas = kraItems.length;
   const totalKeyResultAreasUsed = goalItems.map(y => y.kraId).filter(distinct).length;
   let isValid = false;
   if (totalKeyResultAreas === totalKeyResultAreasUsed && totalGoalBatchWeight === 100) {
      isValid = true;
   }

   // useEffect(() => {
   //    dispatch(submitGoalSetChanged(isValid));
   // }, [dispatch, isValid]);

   return (
      <BrowseGoals 
         items={goalItems}
         groupByFields={groupByFields}
         // layout="cards"
         schema={myGoalsHeader}
         isLoading={isLoadingAllUserGoals || isFetchingAllUserGoals} />
   );
}

export default MyGoalsWrapper;