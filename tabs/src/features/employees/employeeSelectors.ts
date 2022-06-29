import { createSelector } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectEmployee = createSelector(
   [(state: RootState) => state.employee],
   (employee) => employee.item
);

export const selectCurrentEmployee = createSelector(
   [(state: RootState) => state.employee],
   (employee) => employee.currentEmployee
);

export const selectEmployeeFormState = createSelector(
   [(state: RootState) => state.employee],
   (employee) => employee.formState
);

export const selectEmployeeTriggerApi = createSelector(
   [(state: RootState) => state.employee],
   (employee) => employee.triggerApi
);

export const selectEmployeeList = createSelector(
   [(state: RootState) => state.employee],
   (employee) => employee.list
);

// export const selectCompetenciesByYear = createSelector(
//    [(state: RootState) => state.employee],
//    (employee) => {
//       const yearsMapped = employee.list.map(x => x.year);
//       const distinctYears = yearsMapped.filter(distinct);
//       const groupByYearResult = distinctYears.map((x,i) => {
//          const sameYearItems = yearsMapped.filter(y => y === x);
//          const totalSameYearItems = sameYearItems.length;
//          return {
//             key: `key-${x}-${i}`,
//             id: `${x}-${i}`,
//             title: x.toString(),
//             groupByTotal: totalSameYearItems,
//             items: employee.list.filter(z => z.year === x)
//          }
//       });
//       return groupByYearResult;
//    }
// );
