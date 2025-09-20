import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export default store;
