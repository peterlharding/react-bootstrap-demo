import {screen} from '@testing-library/react';

import {renderWithProviders} from '../../test/render';
import {Counter} from './Counter';

const value = () => screen.getByRole('button', {name: 'Decrement value'}).nextElementSibling;

describe('Counter', () => {
  it('increments and decrements', async () => {
    const {user, store} = renderWithProviders(<Counter />);
    await user.click(screen.getByRole('button', {name: 'Increment value'}));
    await user.click(screen.getByRole('button', {name: 'Increment value'}));
    await user.click(screen.getByRole('button', {name: 'Decrement value'}));
    expect(value()).toHaveTextContent('1');
    expect(store.getState().counter.value).toBe(1);
  });

  it('adds the entered amount', async () => {
    const {user} = renderWithProviders(<Counter />);
    const amount = screen.getByRole('textbox', {name: 'Set increment amount'});
    await user.clear(amount);
    await user.type(amount, '5');
    await user.click(screen.getByRole('button', {name: 'Add Amount'}));
    expect(value()).toHaveTextContent('5');
  });

  it('adds only when the value is odd', async () => {
    const {user} = renderWithProviders(<Counter />);
    await user.click(screen.getByRole('button', {name: 'Add If Odd'}));
    expect(value()).toHaveTextContent('0');
    await user.click(screen.getByRole('button', {name: 'Increment value'}));
    await user.click(screen.getByRole('button', {name: 'Add If Odd'}));
    expect(value()).toHaveTextContent('3');
  });

  it('adds asynchronously through the thunk', async () => {
    const {user, store} = renderWithProviders(<Counter />);
    await user.click(screen.getByRole('button', {name: 'Add Async'}));
    expect(store.getState().counter.status).toBe('loading');
    expect(await screen.findByText('2', {selector: 'span'}, {timeout: 2000})).toBeInTheDocument();
    expect(store.getState().counter.status).toBe('idle');
  });
});
