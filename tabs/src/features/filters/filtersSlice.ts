import { createSlice } from '@reduxjs/toolkit';

export const FilterStatusOptions = {
   Created: 'created',
   PendingApproval: "inProgress",
   Completed: "completed",
   Returned: "returned"
}

export const FilterBatchStatusOptions = {
   Creating: 'creating',
   ApprovalManager1: "approvalManager1",
   ApprovalManager2: "approvalManager2",
   ApprovalHR: "approvalHR",
   Updating: "updating",
}

const initialState = {
   popupFilters: [] as string[],
   searchBox: '',
   dateRange: {
      id: '5',
      start: new Date(2022,1,1).getTime(),
      end: new Date(2022,6,1).getTime(),
   },
}

const filtersSlice = createSlice({
   name: 'filters',
   initialState,
   reducers: {
      filterChanged: {
         reducer(state, action) {
            let { selectedFilter, changeType } = action.payload
            const filtersState = state.popupFilters
            switch (changeType) {
               case 'add': {
                  if (!filtersState.includes(selectedFilter)) {
                     filtersState.push(selectedFilter)
                  }
                  break;
               }
               case 'remove': {
                  state.popupFilters = filtersState.filter(
                     (existingFilter) => existingFilter !== selectedFilter
                  );
                  break;
               }
               case 'clear': {
                  state.popupFilters = [];
                  break;
               }
               default:
                  return
            }
            return state;
         },
         prepare(selectedFilter, changeType): any {
            return {
               payload: { selectedFilter, changeType },
            }
         },
      },
      searchQueryChanged(state, action) {
         state = action.payload;
         return state;
      },
		dateRangeChanged: {
			reducer(state, action) {
				let { selectedDateRange } = action.payload
			   state.dateRange = selectedDateRange;
            return state;
			},
			prepare(selectedPeriod): any {
            const selectedDateRange = {
               id: selectedPeriod.id,
               start: selectedPeriod.period.start,
               end: selectedPeriod.period.end,
            }
				return {
					payload: { selectedDateRange },
				}
			},
		},
   },
})

export const { filterChanged, searchQueryChanged, dateRangeChanged } = filtersSlice.actions;
export default filtersSlice.reducer
