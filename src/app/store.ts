import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import users from '@/features/users/state';

export const store = configureStore({
  reducer: {
    users,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
