import { createSelector } from '@reduxjs/toolkit';
import { distinct } from '../../common/utils/sharedFunctions';
import { RootState } from '../../store';

export const selectAppraisal = createSelector(
   [(state: RootState) => state.appraisal],
   (appraisal) => appraisal.item
);

export const selectAppraisalFormState = createSelector(
   [(state: RootState) => state.appraisal],
   (appraisal) => appraisal.formState
);

export const selectAppraisalTriggerApi = createSelector(
   [(state: RootState) => state.appraisal],
   (appraisal) => appraisal.triggerApi
);

export const selectAppraisalList = createSelector(
   [(state: RootState) => state.appraisal],
   (appraisal) => appraisal.list
);


