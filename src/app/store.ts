import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query'

import counterReducer from '../features/counter/counterSlice';


// A factory so tests can create an isolated store; the app uses the `store` singleton below.
export const makeStore = () => configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export const store = makeStore();


// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
