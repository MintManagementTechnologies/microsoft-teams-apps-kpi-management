import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const contextNavSlice = createSlice({
	name: 'contextNav',
	initialState,
	reducers: {
		settingsSectionChanged(state, action) {
			state = action.payload;
         return state;
		}
	},
})

export const { settingsSectionChanged } = contextNavSlice.actions;
export default contextNavSlice.reducer
