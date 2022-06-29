import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Header } from '@fluentui/react-northstar';
import { createSelector } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import GoalBatch from '../../features/goalBatches/GoalBatch';
import {
    searchQueryChanged as goalBatchSearchQueryChanged
} from '../../features/goalBatches/goalBatchSlice';
import GoalList from '../../features/goals/GoalList';
import { useGetGoalsByEmployeeQuery } from '../../features/goals/goalService';
import { formStateChanged, listChanged as goalListChanged } from '../../features/goals/goalSlice';
import MyGoalsHeader from '../../features/goals/parts/rowLayouts/MyGoalsHeader';
import { IGoalModel } from '../../features/goals/types';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';

const BrowseMyGoals = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   let [searchParams, setSearchParams] = useSearchParams();

   const selectedGoals = useTypedSelector((state: RootState) => state.goal.list);
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectFilterResults = useMemo(() => {
      // Return a unique selector instance for this page so that
      // the filtered results are correctly memoized
      return createSelector(
         (res: any) => res.data,
         (data) => {
            let dataResult = data ? data as IGoalModel[] : undefined;
            return dataResult ? dataResult : undefined
         }
      )
   }, [selectedGoalBatch, searchQuery]);
   //eslint-disable-next-line
   const { filteredData, isLoading: isLoadingGetGoalsByEmployee, isFetching: isFetchingGetGoalsByEmployee }
      = useGetGoalsByEmployeeQuery(selectedCurrentEmployee.id || skipToken, {
         selectFromResult: result => {
            return ({
               ...result,
               filteredData: selectFilterResults(result)
            })
         }
      });

   // On Goals List changed
   useEffect(() => {
      if (!filteredData) return;
      let goalList: IGoalModel[] = []; //filteredData;
      if (selectedGoalBatch && selectedGoalBatch.id) {
         goalList = filteredData.filter(x => x.batchId === selectedGoalBatch.id);
         dispatch(formStateChanged(selectedGoalBatch.status === 'draft' ? 'edit' : 'view'));
      }
      dispatch(goalListChanged(goalList));
   }, [selectedGoalBatch, filteredData]);

   // On Appraisal Period changed
   useEffect(() => {
      if (!selectedAppraisalPeriod.id || !selectedCurrentEmployee.id) return;
      dispatch(goalBatchSearchQueryChanged({ userId: selectedCurrentEmployee.id, appraisalPeriodId: selectedAppraisalPeriod.id }));
   }, [selectedAppraisalPeriod, selectedCurrentEmployee]);

   const isLoading = isFetchingGetGoalsByEmployee || isLoadingGetGoalsByEmployee;
   const hasItems = selectedGoals && selectedGoals.length > 0;
   const layout = searchParams.get("layout") === 'list' ? 'groupedByKraAccordion' : 'cards';
   const goalBatchExists = selectedGoalBatch !== undefined && selectedGoalBatch !== null && selectedGoalBatch.id > 0;
   return (
      <Flex column className={`mmt-myGoalsTab mmt-browse-myGoals`}>
         {searchParams.get("layout") === 'list' && <MyGoalsHeader />}
         <GoalBatch as={selectedAppraisalPeriod.active ? undefined : 'hidden'} />
         {/* <GoalBatch as={'hidden'} /> */}
         {/* {selectedGoalBatch && selectedGoalBatch.id > 0 && <GoalList isRootList />} TODO*/}

         {goalBatchExists &&
            <GoalList layout={layout} userId={selectedCurrentEmployee.id} loading={isLoading} />
         }
         {!(isLoading || hasItems) &&
            <Flex fill hAlign="center" className='mmt-rowGutter'>
               <Header as="h4" content={t('common:error.noItemsOfEntity', { entity: t('entity.goal', { count: 0 }).toLocaleLowerCase() })} />
            </Flex>
         }
      </Flex>
   );
}

export default BrowseMyGoals;