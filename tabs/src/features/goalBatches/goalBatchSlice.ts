import { createSelector, createSlice } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';
import mockData from './mockData';
import {
    IGoalBatchItemReviewModel, IGoalBatchModel, IGoalBatchSearchModel, newGoalBatch
} from './types';

interface ISliceState {
   list: IGoalBatchModel[],
   item: IGoalBatchModel,
   formState: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | 'isValid' | '',
   formResult: any,
   triggerApi: boolean,
   searchQuery: any,
}

const initialState: ISliceState = {
   list: [],
   item: newGoalBatch,
   formState: '',
   formResult: null,
   triggerApi: false,
   searchQuery: null,
}

const goalBatchSlice = createSlice({
   name: 'goalBatch',
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
      formStateChanged(state, action) {
         state.formState = action.payload;
         return state;
      },
      formResultChanged(state, action) {
         state.formResult = action.payload;
         return state;
      },
      formResultAdded(state, action) {
         const newResultItem = action.payload as IGoalBatchItemReviewModel;
         const currentFormResults = (state.formResult || []) as IGoalBatchItemReviewModel[];
         const itemIndex = currentFormResults.findIndex(x => x.goalId === newResultItem.goalId);
         //delete draftItems[draftIndex];
         if (itemIndex > -1) {
            state.formResult[itemIndex] = newResultItem;
         } else {
            currentFormResults.push(newResultItem);
            state.formResult = currentFormResults;
         }
         return state;
      },
      formResultRemoved(state, action) {
         const goalId = action.payload as number;
         const currentFormResults = (state.formResult || []) as IGoalBatchItemReviewModel[];
         state.formResult = currentFormResults.filter(x => x.goalId !== goalId);
         return state;
      },
      triggerApiChanged(state, action) {
         state.triggerApi = action.payload;
         return state;
      },
      searchQueryChanged(state, action) {
         state.searchQuery = action.payload;
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

export default goalBatchSlice.reducer;

export const { itemAdded, itemUpdated, itemDeleted }
   = goalBatchSlice.actions;
export const { listChanged, itemChanged, formStateChanged, formResultChanged, formResultAdded, formResultRemoved, triggerApiChanged, searchQueryChanged, sliceChanged }
   = goalBatchSlice.actions;