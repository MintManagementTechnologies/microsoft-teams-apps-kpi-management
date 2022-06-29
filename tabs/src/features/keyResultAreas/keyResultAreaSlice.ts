import { createSelector, createSlice } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';
import mockData from './mockData';
import { IKeyResultAreaModel, newKeyResultArea } from './types';

interface ISliceState {
   list: IKeyResultAreaModel[],
   item: IKeyResultAreaModel,
   formState: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   formResult: any,
   triggerApi: boolean,
}

const initialState: ISliceState & { itemId: number | string } = {
   list: [],
   item: newKeyResultArea,
   formState: '',
   formResult: null,
   triggerApi: false,
   itemId: 0,
}

const keyResultAreaSlice = createSlice({
   name: 'keyResultArea',
   initialState,
   reducers: {
      listChanged(state, action) {
         state.list = action.payload;
         return state;
      },
      itemChanged(state, action) {
         state.item = action.payload;
         return state;
      },
      itemIdChanged(state, action) {
         state.itemId = action.payload;
         return state;
      },
      formStateChanged(state, action) {
         state.formState = action.payload;
         return state;
      },
      formResultChanged(state, action) {
         state.formResult = action.payload;
         return state;
      },
      triggerApiChanged(state, action) {
         state.triggerApi = action.payload;
         return state;
      },
      sliceChanged(state, action) {
         const { item, formState, triggerApi } = action.payload;
         state.item = item === undefined ? state.item : item;
         state.formState = formState === undefined ? state.formState : formState;
         state.triggerApi = triggerApi === undefined ? state.triggerApi : triggerApi;
         return state;
      },
      // temporary for mock data
      itemAdded(state, action) {
         const item = {
            ...action.payload,
            id: Math.floor(Math.random() * 10000) + 1
         };

         state.list.push(item);
         return state;
      },
      itemUpdated(state, action) {
         const updatedItem = action.payload;
         const list = state.list;
         state.list = list.map(x => {
            if (x.id === updatedItem.id) return updatedItem;
            return x;
         });
         return state;
      },
      itemDeleted(state, action) {
         const item = action.payload;
         const list = state.list;
         state.list = list.filter(x => x.id !== item.id);
         return state;
      },
   },
})

export default keyResultAreaSlice.reducer;

export const { itemAdded, itemUpdated, itemDeleted }
   = keyResultAreaSlice.actions;
export const { itemIdChanged, itemChanged, formStateChanged, formResultChanged, triggerApiChanged, sliceChanged, listChanged, }
   = keyResultAreaSlice.actions;

export const selectKeyResultArea = createSelector(
   [(state: RootState) => state.keyResultArea],
   (keyResultArea) => keyResultArea.item
);

export const selectKeyResultAreaId = createSelector(
   [(state: RootState) => state.keyResultArea],
   (keyResultArea) => keyResultArea.itemId
);

export const selectKeyResultAreaFormState = createSelector(
   [(state: RootState) => state.keyResultArea],
   (keyResultArea) => keyResultArea.formState
);

export const selectKeyResultAreaTriggerApi = createSelector(
   [(state: RootState) => state.keyResultArea],
   (keyResultArea) => keyResultArea.triggerApi
);

export const selectKeyResultAreaList = createSelector(
   [(state: RootState) => state.keyResultArea],
   (keyResultArea) => keyResultArea.list
);

export const selectAllGoalKRAs = createSelector(
   [
      (state: RootState) => state.goal.list,
      (state: RootState) => state.appraisal.item.goals
   ],
   (goalList, appraisalGoalList) => {
      const currentList:any[] = appraisalGoalList && appraisalGoalList.length !== 0 ? appraisalGoalList : goalList;
      // const kras = goal.list.map(x => ({ id: x.kraId, title: x.kraTitle }));
      const krasMapped = currentList.map(x => x.kraTitle);
      const distinctKras = krasMapped.filter(distinct);
      const groupByKraResult = distinctKras.map((x, i) => {
         const sameKraItems = currentList.filter(y => y.kraTitle === x);
         const totalKraWeight = sameKraItems.reduce((accumulator, object) => {
            return accumulator + object.weight;
         }, 0);
         return {
            key: `key-${x}-${i}`,
            id: `${x}`,
            title: x,
            groupByTotal: totalKraWeight,
            totalItems: sameKraItems.length
         }
      });
      return groupByKraResult;
   }
);

