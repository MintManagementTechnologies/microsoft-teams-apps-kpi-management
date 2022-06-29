import { createSelector } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectCompetency = createSelector(
   [(state: RootState) => state.competency],
   (competency) => competency.item
);

export const selectCompetencyFormState = createSelector(
   [(state: RootState) => state.competency],
   (competency) => competency.formState
);

export const selectCompetencyTriggerApi = createSelector(
   [(state: RootState) => state.competency],
   (competency) => competency.triggerApi
);

export const selectCompetencyList = createSelector(
   [(state: RootState) => state.competency],
   (competency) => competency.list
);

// export const selectCompetenciesByYear = createSelector(
//    [(state: RootState) => state.competency],
//    (competency) => {
//       const yearsMapped = competency.list.map(x => x.year);
//       const distinctYears = yearsMapped.filter(distinct);
//       const groupByYearResult = distinctYears.map((x,i) => {
//          const sameYearItems = yearsMapped.filter(y => y === x);
//          const totalSameYearItems = sameYearItems.length;
//          return {
//             key: `key-${x}-${i}`,
//             id: `${x}-${i}`,
//             title: x.toString(),
//             groupByTotal: totalSameYearItems,
//             items: competency.list.filter(z => z.year === x)
//          }
//       });
//       return groupByYearResult;
//    }
// );
