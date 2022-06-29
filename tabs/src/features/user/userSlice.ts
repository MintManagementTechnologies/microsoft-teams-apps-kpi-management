import { createSlice } from '@reduxjs/toolkit';
import { currentUserUPN } from '../../common/utils/commonVariables';
import { getLocale } from '../../common/utils/sharedFunctions';

const initialState = {
   displayName: '',
   upn: currentUserUPN,
   id: '',
   locale: getLocale(),
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userDetailsChanged(state, action) {
			state = action.payload;
         return state;
		}
	},
})

export const { userDetailsChanged } = userSlice.actions;
export default userSlice.reducer
