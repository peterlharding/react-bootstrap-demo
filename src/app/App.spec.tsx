import {screen, within} from '@testing-library/react';

import {renderWithProviders} from '../test/render';
import App from './App';

const pageHeading = () =>
  within(document.querySelector('.header-footer-layout-body')!).getAllByRole('heading', {level: 1})[0];

describe('App routes', () => {
  it.each([
    ['/', 'Sandpit'],
    ['/home', 'Sandpit'],
    ['/modal-example', null],
    ['/one', 'Working with Colour Pickers'],
    ['/two', 'The React Counter'],
    ['/help', 'Help'],
    ['/release-notes', 'Release Notes'],
    ['/about', 'About'],
  ])('renders %s', (route, heading) => {
    renderWithProviders(<App />, {route});
    if (heading) {
      expect(pageHeading()).toHaveTextContent(new RegExp(`^${heading}$`));
    } else {
      expect(screen.getByRole('button', {name: 'Launch demo modal'})).toBeInTheDocument();
    }
  });

  it('navigates with the footer links', async () => {
    const {user} = renderWithProviders(<App />, {route: '/two'});
    const footer = document.querySelector('.header-footer-layout-footer') as HTMLElement;

    await user.click(within(footer).getByRole('link', {name: 'Help'}));
    expect(pageHeading()).toHaveTextContent(/^Help$/);

    await user.click(within(footer).getByRole('link', {name: 'About'}));
    expect(pageHeading()).toHaveTextContent(/^About$/);
  });
});
