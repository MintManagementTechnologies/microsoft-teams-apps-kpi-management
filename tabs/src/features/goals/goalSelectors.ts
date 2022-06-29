import { createSelector } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectGoal = createSelector(
   [(state: RootState) => state.goal],
   (goal) => goal.item
);

export const selectGoalFormState = createSelector(
   [(state: RootState) => state.goal],
   (goal) => goal.formState
);

export const selectGoalTriggerApi = createSelector(
   [(state: RootState) => state.goal],
   (goal) => goal.triggerApi
);

export const selectGoalList = createSelector(
   [(state: RootState) => state.goal],
   (goal) => goal.list
);

export const selectGoalsByKra = createSelector(
   [(state: RootState) => state.goal],
   (goal) => {
      // const kras = goal.list.map(x => ({ id: x.kraId, title: x.kraTitle }));
      const krasMapped = goal.list.map(x => x.kraId);
      const distinctKras = krasMapped.filter(distinct);
      const groupByKraResult = distinctKras.map((x, i) => {
         const sameKraItems = krasMapped.filter(y => y === x);
         const totalSameKraItems = sameKraItems.length;
         return {
            key: `key-${x}-${i}`,
            id: `${x}-${i}`,
            title: goal.list.find(z => z.kraId === x)?.kraTitle,
            groupByTotal: totalSameKraItems,
            items: goal.list.filter(z => z.kraId === x)
         }
      });
      return groupByKraResult;
   }
);

export const makeSelectUserGoalsByKra = (userId: number) => {
   const selectUserGoalsByKra = createSelector(
      [(state: RootState) => state.goal.list],
      (list) => {
         // const kras = goal.list.map(x => ({ id: x.kraId, title: x.kraTitle }));
         const filteredList = userId ? list.filter(item => item.userId === userId) : list;
         const krasMapped = filteredList.map(x => x.kraId);
         const distinctKras = krasMapped.filter(distinct);
         const groupByKraResult = distinctKras.map((x, i) => {
            const sameKraItems = krasMapped.filter(y => y === x);
            const totalSameKraItems = sameKraItems.length;
            return {
               key: `key-${x}-${i}`,
               id: `${x}-${i}`,
               title: filteredList.find(z => z.kraId === x)?.kraTitle,
               groupByTotal: totalSameKraItems,
               items: filteredList.filter(z => z.kraId === x)
            }
         });
         return groupByKraResult;
      }
   )
   return selectUserGoalsByKra
}

export const selectGoalsByUser = createSelector(
   [(state: RootState) => state.goal],
   (goal) => {
      const users = goal.list.map(x => ({ id: x.userId, title: x.userDisplayName }));
      const usersMapped = goal.list.map(x => x.userId);
      const distinctUsers = usersMapped.filter(distinct);
      const groupByUserResult = distinctUsers.map((x, i) => {
         const userTitle = users.find(y => y.id === x)?.title;

         const sameUserItems = usersMapped.filter(y => y === x);
         const totalSameUserItems = sameUserItems.length;
         return {
            key: `key-${x}-${i}`,
            id: x,
            title: userTitle,
            groupByTotal: totalSameUserItems,
            items: goal.list.filter(z => z.userId === x)
         }
      });
      return groupByUserResult;
   }
);

export const selectTotalGoalsWeight = createSelector(
   [(state: RootState) => state.goal.list],
   (list) => {
      if(!list) return 0;
      const totalGoalsWeight = list.reduce((accumulator, object) => {
         return accumulator + object.weight;
      }, 0);
      return totalGoalsWeight;
   }
);