import { createSelector, createSlice } from '@reduxjs/toolkit';

import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';
import mockData from './mockData';
import { IWorkgradeModel } from './types';

interface ISliceState {
   itemId:number,
}

const initialState: ISliceState = {
   itemId: 0,
}

const workgradeSlice = createSlice({
   name: 'workgrade',
   initialState,
   reducers: {
      itemIdChanged(state, action) {
         state.itemId = action.payload;
         return state;
      },
   },
})

export default workgradeSlice.reducer;

export const { itemIdChanged }
   = workgradeSlice.actions;