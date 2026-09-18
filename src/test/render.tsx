import type {ReactElement} from 'react';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router';

import {makeStore} from '../app/store';

// Renders `ui` with a fresh Redux store and an in-memory router starting at `route`.
export const renderWithProviders = (ui: ReactElement, {route = '/', store = makeStore()} = {}) => ({
  store,
  user: userEvent.setup(),
  ...render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  ),
});
