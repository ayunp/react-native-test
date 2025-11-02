import { createSlice } from "@reduxjs/toolkit"

const stepSlice = createSlice({
    name: 'vitality',
    initialState: {
        steps: 0,
        points: 0
    },
    reducers: {
        incrementSteps: (state, action) => {
            state.steps += action.payload;
            state.points = Math.floor(state.steps/100); // setiap 100 langkah dapat 1 poin
        },
        reset: (state) => {
            state.steps = 0;
            state.points = 0;
        }
    }
});

export const { incrementSteps, reset } = stepSlice.actions; 
export default stepSlice.reducer