import {screen, within} from '@testing-library/react';

import App from '../app/App';
import {renderWithProviders} from '../test/render';
import TopNavBar from './TopNavBar';

const navbar = () => within(screen.getByRole('navigation'));

describe('TopNavBar', () => {
  it('links the brand and Home to /home', () => {
    renderWithProviders(<TopNavBar />);
    expect(navbar().getByRole('link', {name: /Sandpit/})).toHaveAttribute('href', '/home');
    expect(navbar().getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/home');
  });

  it('gives each dropdown a unique id', () => {
    renderWithProviders(<TopNavBar />);
    const ids = [...document.querySelectorAll('.navbar .dropdown-toggle')].map((b) => b.id);
    expect(ids).toEqual(['experimental-nav-dropdown', 'help-nav-dropdown']);
  });

  it.each([
    ['Experimental', [
      ['Modal Example', '/modal-example'],
      ['One - Color Picker', '/one'],
      ['Two - The React Counter', '/two'],
    ]],
    ['Help', [
      ['Help', '/help'],
      ['Release Notes', '/release-notes'],
      ['About', '/about'],
    ]],
  ])('lists the %s menu items', async (menu, items) => {
    const {user} = renderWithProviders(<TopNavBar />);
    await user.click(navbar().getByRole('button', {name: menu}));
    const menuItems = [...document.querySelectorAll('.dropdown-menu.show a.dropdown-item')]
      .map((a) => [a.textContent, a.getAttribute('href')]);
    expect(menuItems).toEqual(items);
  });

  it('marks the current route active', () => {
    renderWithProviders(<TopNavBar />, {route: '/home'});
    expect(navbar().getByRole('link', {name: 'Home'})).toHaveClass('active');
  });

  it('navigates client-side from a dropdown item', async () => {
    const {user} = renderWithProviders(<App />, {route: '/home'});
    await user.click(navbar().getByRole('button', {name: 'Experimental'}));
    const menu = () => within(document.querySelector('.navbar .dropdown-menu') as HTMLElement);
    await user.click(menu().getByText('Two - The React Counter'));
    expect(screen.getByRole('heading', {name: 'The React Counter', level: 1})).toBeInTheDocument();
    expect(menu().getByText('Two - The React Counter')).toHaveClass('active');
    expect(navbar().getByRole('link', {name: 'Home'})).not.toHaveClass('active');
  });
});
