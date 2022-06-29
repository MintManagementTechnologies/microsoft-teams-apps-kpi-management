import { createSlice } from '@reduxjs/toolkit';

import mockData from './mockData';
import {
    IAppraisalGoalReviewModel, IAppraisalListItemModel, IAppraisalModel, IAppraisalReviewModel,
    IAppraisalX, newAppraisalX
} from './types';

// interface ISliceState {
//    list: IAppraisalListItemModel[],
//    item: IAppraisalModel,
//    formState: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
//    formResult: any,
//    triggerApi: boolean,
// }

// const initialState: ISliceState = {
//    list: mockData,
//    item: newAppraisal,
//    formState: '',
//    formResult: null,
//    triggerApi: false,
// }

interface ISliceState {
   list: IAppraisalX[],
   item: IAppraisalX,
   formState: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   formResult: IAppraisalGoalReviewModel[], //any,
   triggerApi: boolean,
}
// TODO remove array and set any

export interface IGoalBatchItemReviewModel {
   kraTitle: string,
   kraId: number,
   goalId: number,
   approved: boolean
}
const initialState: ISliceState = {
   list: [],
   item: newAppraisalX,
   formState: '',
   formResult: [], //null,
   triggerApi: false,
}
// TODO remove array and set NULL
const appraisalSlice = createSlice({
   name: 'appraisal',
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
      itemListChanged(state, action) {
         state.item.goals = action.payload;
         return state;
      },
      formStateChanged(state, action) {
         state.formState = action.payload;
         return state;
      },
      formResultAdded(state, action) {
         const newResultItem = action.payload as IAppraisalGoalReviewModel;
         const currentFormResults = (state.formResult || []) as IAppraisalGoalReviewModel[];
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
         const currentFormResults = (state.formResult || []) as IAppraisalGoalReviewModel[];
         state.formResult = currentFormResults.filter(x => x.goalId !== goalId);
         return state;
      },
      formResultCompleted(state, action) {
         const completedResult = action.payload as { goalId: number, completed: boolean };
         const currentFormResults = (state.formResult || []) as IAppraisalGoalReviewModel[];
         const itemIndex = currentFormResults.findIndex(x => x.goalId === completedResult.goalId);
         //delete draftItems[draftIndex];
         if (itemIndex > -1) {
            state.formResult[itemIndex].completed = completedResult.completed;
         } else {
            debugger;
         }
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
            if (x.title === updatedItem.title) return updatedItem;
            // if (x.name === updatedItem.name) return updatedItem;
            return x;
         });
         return state;
      },
      itemDeleted(state, action) {
         const item = action.payload;
         const list = state.list;
         state.list = list.filter(x => x.title !== item.title);
         // state.list = list.filter(x => x.name !== item.name);
         return state;
      },
   },
})

export default appraisalSlice.reducer;

export const { itemAdded, itemUpdated, itemDeleted }
   = appraisalSlice.actions;
export const { itemChanged, itemListChanged, listChanged, formResultAdded, formResultRemoved, formResultCompleted, formStateChanged, formResultChanged, triggerApiChanged, sliceChanged }
   = appraisalSlice.actions;