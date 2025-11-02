import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';
import userReduser from './userSlice';

const store = configureStore({
  reducer: {
    step: stepReducer,
    user: userReduser
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
