import { createSelector } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectAppraisalPeriod = createSelector(
   [(state: RootState) => state.appraisalPeriod],
   (appraisalPeriod) => appraisalPeriod.item
);

export const selectAppraisalPeriodFormState = createSelector(
   [(state: RootState) => state.appraisalPeriod],
   (appraisalPeriod) => appraisalPeriod.formState
);

export const selectAppraisalPeriodTriggerApi = createSelector(
   [(state: RootState) => state.appraisalPeriod],
   (appraisalPeriod) => appraisalPeriod.triggerApi
);

export const selectAppraisalPeriodList = createSelector(
   [(state: RootState) => state.appraisalPeriod],
   (appraisalPeriod) => appraisalPeriod.list
);

export const selectAppraisalPeriodsByYear = createSelector(
   [(state: RootState) => state.appraisalPeriod],
   (appraisalPeriod) => {
      const yearsMapped = appraisalPeriod.list.map(x => x.year);
      const distinctYears = yearsMapped.filter(distinct);
      const groupByYearResult = distinctYears.map((x,i) => {
         const sameYearItems = yearsMapped.filter(y => y === x);
         const totalSameYearItems = sameYearItems.length;
         return {
            key: `key-${x}-${i}`,
            id: `${x}-${i}`,
            title: x.toString(),
            groupByTotal: totalSameYearItems,
            items: appraisalPeriod.list.filter(z => z.year === x)
         }
      });
      return groupByYearResult;
   }
);
