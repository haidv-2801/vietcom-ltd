import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import filterRecuder from './slices/filterSlice';

const rootReducer = {
  app: appReducer,
  filter: filterRecuder,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
