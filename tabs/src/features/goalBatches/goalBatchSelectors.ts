import { createSelector } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectGoalBatch = createSelector(
   [(state: RootState) => state.goalBatch],
   (goalBatch) => goalBatch.item
);

export const selectGoalBatchFormState = createSelector(
   [(state: RootState) => state.goalBatch],
   (goalBatch) => goalBatch.formState
);

export const selectGoalBatchTriggerApi = createSelector(
   [(state: RootState) => state.goalBatch],
   (goalBatch) => goalBatch.triggerApi
);

export const selectGoalBatchSearchQuery = createSelector(
   [(state: RootState) => state.goalBatch],
   (goalBatch) => goalBatch.searchQuery
);

export const selectGoalBatchList = createSelector(
   [(state: RootState) => state.goalBatch],
   (goalBatch) => goalBatch.list
);

// export const selectGoalBatchesByYear = createSelector(
//    [(state: RootState) => state.goalBatch],
//    (goalBatch) => {
//       const yearsMapped = goalBatch.list.map(x => x.year);
//       const distinctYears = yearsMapped.filter(distinct);
//       const groupByYearResult = distinctYears.map((x,i) => {
//          const sameYearItems = yearsMapped.filter(y => y === x);
//          const totalSameYearItems = sameYearItems.length;
//          return {
//             key: `key-${x}-${i}`,
//             id: `${x}-${i}`,
//             title: x.toString(),
//             groupByTotal: totalSameYearItems,
//             items: goalBatch.list.filter(z => z.year === x)
//          }
//       });
//       return groupByYearResult;
//    }
// );
