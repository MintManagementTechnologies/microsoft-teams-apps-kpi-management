import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Header } from '@fluentui/react-northstar';
import { createSelector } from '@reduxjs/toolkit';

import Loader from '../../components/common/Loader';
import AppraisalListX from '../../features/appraisals/AppraisalListX';
import { useLazyGetAppraisalsAsReviewerQuery } from '../../features/appraisals/appraisalService';
import {
    formStateChanged, listChanged as appraisalListChanged
} from '../../features/appraisals/appraisalSlice';
import TeamAppraisalsHeader from '../../features/appraisals/parts/rowLayouts/TeamAppraisalsHeader';
import { useGetGoalsByAppraisalPeriodQuery } from '../../features/goals/goalService';
import { IGoalModel } from '../../features/goals/types';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';

const BrowseTeamAppraisals = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   let [searchParams, setSearchParams] = useSearchParams();

   const selectedGoals = useTypedSelector((state: RootState) => state.goal.list);
   const selectedGoalBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const [triggerGetAppraisalsAsReviewer,
      { data: dataGetAppraisalsAsReviewer, isFetching: isFetchingGetAppraisalsAsReviewer, isLoading: isLoadingGetAppraisalsAsReviewer }]
      = useLazyGetAppraisalsAsReviewerQuery();

   const selectFilterResults = useMemo(() => {
      // Return a unique selector instance for this page so that
      // the filtered results are correctly memoized
      return createSelector(
         (res: any) => res.data,
         (data) => {
            let batchIds = dataGetAppraisalsAsReviewer?.map(x => x.id);
            let dataResult = data ? data.filter((x: any) => batchIds?.includes(x.batchId)) as IGoalModel[] : undefined;
            return dataResult ? dataResult : undefined
         }
      )
   }, [dataGetAppraisalsAsReviewer, searchQuery]);
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
      if (selectedAppraisalPeriod.id <= 0 || selectedCurrentEmployee.id <= 0) return;
      triggerGetAppraisalsAsReviewer({ userId: selectedCurrentEmployee.id, appraisalPeriodId: selectedAppraisalPeriod.id });
   }, [selectedAppraisalPeriod, selectedCurrentEmployee]);

   // On Goals List changed
   useEffect(() => {
      if (!dataGetAppraisalsAsReviewer) return;
      dispatch(formStateChanged('view'));
      dispatch(appraisalListChanged(dataGetAppraisalsAsReviewer));
   }, [dataGetAppraisalsAsReviewer]);

   // On Appraisal Period changed
   // useEffect(() => {
   //    if (!selectedAppraisalPeriod.id) return;
   //    dispatch(goalBatchSearchQueryChanged({ userId: selectedCurrentEmployee.id, appraisalPeriodId: selectedAppraisalPeriod.id }));
   // }, [selectedAppraisalPeriod]);

   const layout = 'flatTable'; //'groupedByUserAccordion';
   const isLoading = isFetchingGetGoalsByAppraisalPeriod || isLoadingGetGoalsByAppraisalPeriod || isFetchingGetAppraisalsAsReviewer || isLoadingGetAppraisalsAsReviewer;
   const hasItems = filteredData && filteredData.length > 0;
   return (
      <Flex column className={`mmt-myAppraisalsTab mmt-browse-teamAppraisals`}>
         <TeamAppraisalsHeader />
         {/* <GoalBatch as={'hidden'} /> */}
         {/* {selectedGoalBatch && selectedGoalBatch.id > 0 && <GoalList isRootList />} TODO*/}
         {isLoading && <Loader message={t('entity.appraisal', { count: 0 })} />}
         {!isLoading && <AppraisalListX layout={layout} items={dataGetAppraisalsAsReviewer} />}
         {!(isLoading || hasItems) &&
            <Flex fill hAlign="center" className='mmt-rowGutter'>
               <Header as="h4" content={t('common:error.noTeamAppraisalSubmissions')} />
            </Flex>
         }
      </Flex>
   );
}

export default BrowseTeamAppraisals;

// const AppraisalList = (props: { items?: any[], layout?: string, displayMode?: string, isRootList?: boolean }): JSX.Element => {