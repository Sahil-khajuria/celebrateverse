import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import builderReducer from './slices/builderSlice'
import celebrationReducer from './slices/celebrationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    builder: builderReducer,
    celebration: celebrationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['auth.user'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
