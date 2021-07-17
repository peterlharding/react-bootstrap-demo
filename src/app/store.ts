import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query'

import counterReducer from '../features/counter/counterSlice';


export const store = configureStore({
  reducer: {

    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});


// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
