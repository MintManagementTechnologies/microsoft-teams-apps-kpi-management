import { createSelector, createSlice } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';
import mockData from './mockData';
import { ICompetencyModel, newCompetency } from './types';

interface ISliceState {
   list: ICompetencyModel[],
   item: ICompetencyModel,
   formState: 'new' | 'view' | 'edit' | 'delete' | 'closeForm' | '',
   formResult: any,
   triggerApi: boolean,
}

const initialState: ISliceState = {
   list: [],
   item: newCompetency,
   formState: '',
   formResult: null,
   triggerApi: false,
}

const competencySlice = createSlice({
   name: 'competency',
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

export default competencySlice.reducer;

export const { itemAdded, itemUpdated, itemDeleted }
   = competencySlice.actions;
export const { itemChanged, formStateChanged, formResultChanged, triggerApiChanged, sliceChanged, listChanged }
   = competencySlice.actions;