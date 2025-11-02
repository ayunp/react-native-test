import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';

const store = configureStore({
  reducer: {
    vitality: stepReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
