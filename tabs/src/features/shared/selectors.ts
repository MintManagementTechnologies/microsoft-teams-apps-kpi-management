import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export const selectCloseModalState = createSelector(
   [
      (state: RootState) => state.goal.formState,
      (state: RootState) => state.goalBatch.formState,
      (state: RootState) => state.appraisal.formState,
      (state: RootState) => state.appraisalPeriod.formState,
      (state: RootState) => state.competency.formState,

      (state: RootState) => state.goal.formResult,
      (state: RootState) => state.goalBatch.formResult,
      (state: RootState) => state.appraisal.formResult,
      (state: RootState) => state.appraisalPeriod.formResult,
      (state: RootState) => state.competency.formResult,
   ],
   (
      goalFormState,
      goalBatchFormState,
      appraisalFormState,
      appraisalPeriodFormState,
      comptencyFormState,
      goalFormResult,
      goalBatchFormResult,
      appraisalFormResult,
      appraisalPeriodFormResult,
      competencyFormResult,
   ) => {
      if (goalFormState === 'closeForm') {
         return {
            action: goalFormState,
            additionalInfo: goalFormResult
         }
      } else if (goalBatchFormState === 'closeForm') {
         return {
            action: goalBatchFormState,
            additionalInfo: goalBatchFormResult
         }
      } else if (appraisalFormState === 'closeForm') {
         return {
            action: appraisalFormState,
            additionalInfo: appraisalFormResult
         }
      } else if (appraisalPeriodFormState === 'closeForm') {
         return {
            action: appraisalPeriodFormState,
            additionalInfo: appraisalPeriodFormResult
         }
      } else if (comptencyFormState === 'closeForm') {
         return {
            action: comptencyFormState,
            additionalInfo: competencyFormResult
         }
      } else {
         return;
      }
   }
);