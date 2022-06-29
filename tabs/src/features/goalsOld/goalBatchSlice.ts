import { createSlice } from '@reduxjs/toolkit';
import { IGoalApproverModel } from '../../common/types/approver';

const initialState: IGoalApproverModel[] = [];

const goalBatchSlice = createSlice({
   name: 'goalBatch',
   initialState,
   reducers: {
      singleGoalApprovalChanged: {
         reducer(state, action) {
            let goalApproval = action.payload as IGoalApproverModel;
            let goalIndex = state.findIndex(x => x.goalId === goalApproval.goalId);
            state[goalIndex] = {
               ...state[goalIndex],
               ...goalApproval
            };
            return state;
         },
         prepare(_goalId, _comments, _approved, _requiresReview, _outcome): any {
            return {
               payload: { 
                  goalId: _goalId,
                  comments: _comments,
                  approved: _approved,
                  requiresReview: _requiresReview,
                  outcome: _outcome
               }
            }
         },
      },
      goalBatchChanged(state, action) {
         state = action.payload;
         return state;
      }
   },
})

export const { goalBatchChanged, singleGoalApprovalChanged } = goalBatchSlice.actions;
export default goalBatchSlice.reducer
