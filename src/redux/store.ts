import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';

const store = configureStore({
  reducer: {
    vitality: stepReducer,
  },
});

export default store;
