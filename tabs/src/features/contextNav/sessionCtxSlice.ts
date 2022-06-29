import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISessionCtx { 
   token: string;
}

const initialState:ISessionCtx ={
   token: `${process.env.REACT_APP_BACKEND_API_TOKEN}`
}

const sessionCtxSlice = createSlice({
   name: 'sessionCtx',
   initialState: initialState,
   reducers: {
      setToken: (
         state,
         { payload: { token } }: PayloadAction<{ token: string }>
      ) => {
         state.token = token
      },
   },
})

export const { setToken } = sessionCtxSlice.actions;

export default sessionCtxSlice.reducer;