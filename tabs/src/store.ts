
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';

import appraisalPeriodSlice from './features/appraisalPeriods/appraisalPeriodSlice';
import appraisalSlice from './features/appraisals/appraisalSlice';
import competencySlice from './features/competencies/competencySlice';
// import kraContextNavSlice from './features/contextNav/parts/kraContextNav/kraContextNavSlice';
import sessionCtxSlice from './features/contextNav/sessionCtxSlice';
import employeeSlice from './features/employees/employeeSlice';
//import { baseApi, baseGraphApi, baseBotApi } from './services';
import filtersSlice from './features/filters/filtersSlice';
import goalBatchSlice from './features/goalBatches/goalBatchSlice';
import goalSlice from './features/goals/goalSlice';
import oldGoalBatchSlice from './features/goalsOld/goalBatchSlice';
import keyResultAreaSlice from './features/keyResultAreas/keyResultAreaSlice';
import userSlice from './features/user/userSlice';
import workgradeSlice from './features/workgrades/workgradeSlice';
import { baseApi, baseGraphApi, baseNotificationApi } from './services';

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [baseGraphApi.reducerPath]: baseGraphApi.reducer,
      [baseNotificationApi.reducerPath]: baseNotificationApi.reducer,
      //[baseBotApi.reducerPath]: baseBotApi.reducer,
      goal: goalSlice,
      goalBatch: goalBatchSlice,
      keyResultArea: keyResultAreaSlice,
      appraisal: appraisalSlice,
      appraisalPeriod: appraisalPeriodSlice,
      competency: competencySlice,
      workgrade: workgradeSlice,
      sessionCtx: sessionCtxSlice,
      filters: filtersSlice,
      // currentKRA: kraContextNavSlice,
      employee: employeeSlice,
      currentUser: userSlice,
      oldGoalBatch: oldGoalBatchSlice,
    },
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware, baseGraphApi.middleware, baseNotificationApi.middleware),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;