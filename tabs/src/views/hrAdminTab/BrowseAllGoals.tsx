import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Header } from '@fluentui/react-northstar';
import { createSelector } from '@reduxjs/toolkit';

import Loader from '../../components/common/Loader';
import {
    useLazyGetGoalBatchesPendingApprovalQuery
} from '../../features/goalBatches/goalBatchService';
import { listChanged as goalBatchListChanged } from '../../features/goalBatches/goalBatchSlice';
import GoalList from '../../features/goals/GoalList';
import { useGetGoalsByAppraisalPeriodQuery } from '../../features/goals/goalService';
import { formStateChanged, listChanged as goalListChanged } from '../../features/goals/goalSlice';
import TeamGoalsHeader from '../../features/goals/parts/rowLayouts/TeamGoalsHeader';
import { IGoalModel } from '../../features/goals/types';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';

const BrowseAllGoals = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   let [searchParams, setSearchParams] = useSearchParams();

   const selectedGoals = useTypedSelector((state: RootState) => state.goal.list);
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const [triggerGetGoalBatchesPendingApproval,
      { data: dataGetGoalBatchesPendingApproval, isFetching: isFetchingGetGoalBatchesPendingApproval, isLoading: isLoadingGetGoalBatchesPendingApproval }]
      = useLazyGetGoalBatchesPendingApprovalQuery();

   const selectFilterResults = useMemo(() => {
      // Return a unique selector instance for this page so that
      // the filtered results are correctly memoized
      return createSelector(
         (res: any) => res.data,
         (data) => {
            let batchIds = dataGetGoalBatchesPendingApproval?.map(x => x.id);
            let dataResult = data ? data.filter((x: any) => batchIds?.includes(x.batchId)) as IGoalModel[] : undefined;
            return dataResult ? dataResult : undefined
         }
      )
   }, [dataGetGoalBatchesPendingApproval, searchQuery]);
   //eslint-disable-next-line
   const { filteredData, isLoading: isLoadingGetGoalsByAppraisalPeriod, isFetching: isFetchingGetGoalsByAppraisalPeriod }
      = useGetGoalsByAppraisalPeriodQuery(selectedAppraisalPeriod.id, {
         selectFromResult: result => {
            return ({
               ...result,
               filteredData: selectFilterResults(result)
            })
         }
      });

   // On Goals List changed
   useEffect(() => {
      if (selectedAppraisalPeriod.id <= 0) return;
      triggerGetGoalBatchesPendingApproval({ userId: selectedCurrentEmployee.id, appraisalPeriodId: selectedAppraisalPeriod.id });
   }, [selectedAppraisalPeriod, selectedCurrentEmployee]);

   // On Goals List changed
   useEffect(() => {
      dispatch(formStateChanged('view'));
      dispatch(goalListChanged(filteredData));
   }, [filteredData]);

   // On Goal Batch List changed
   useEffect(() => {
      dispatch(goalBatchListChanged(dataGetGoalBatchesPendingApproval));
   }, [dataGetGoalBatchesPendingApproval]);

   // On Appraisal Period changed
   // useEffect(() => {
   //    if (!selectedAppraisalPeriod.id) return;
   //    dispatch(goalBatchSearchQueryChanged({ userId: selectedCurrentEmployee.id, appraisalPeriodId: selectedAppraisalPeriod.id }));
   // }, [selectedAppraisalPeriod]);

   const layout = 'groupedByUserAccordion';
   const isLoading = isFetchingGetGoalsByAppraisalPeriod || isLoadingGetGoalsByAppraisalPeriod || isFetchingGetGoalBatchesPendingApproval || isLoadingGetGoalBatchesPendingApproval;
   const hasItems = filteredData && filteredData.length > 0;
   return (
      <Flex column className={`mmt-myGoalsTab mmt-browse-teamGoals`}>
         <TeamGoalsHeader />
         {/* <GoalBatch as={'hidden'} /> */}
         {/* {selectedGoalBatch && selectedGoalBatch.id > 0 && <GoalList isRootList />} TODO*/}
         {isLoading && <Loader message={t('entity.goal', { count: 0 })} />}
         {!isLoading && <GoalList layout={layout} userId={selectedCurrentEmployee.id} />}
         {!(isLoading || hasItems) &&
            <Flex fill hAlign="center" className='mmt-rowGutter'>
               <Header as="h4" content={t('common:error.noTeamGoalSubmissions')} />
            </Flex>
         }
      </Flex>
   );
}

export default BrowseAllGoals;