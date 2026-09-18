import {existsSync, readdirSync} from 'node:fs';

import {screen, within} from '@testing-library/react';

import {dependencies, scripts, version} from '../../package.json';
import {experiments} from '../app/experiments';
import {renderWithProviders} from '../test/render';
import About from './About';
import Help from './Help';
import One from './One';
import Two from './Two';
import Home from './Home';
import ReleaseNotes from './ReleaseNotes';

describe('Home', () => {
  it('links each experiment card to its page', () => {
    renderWithProviders(<Home />);
    for (const {name, to} of experiments) {
      expect(screen.getByRole('heading', {name, level: 3})).toBeInTheDocument();
      expect(screen.getByRole('link', {name: `Try it: ${name}`})).toHaveAttribute('href', to);
    }
  });

  it('offers help and about as the main actions', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('link', {name: 'Get started'})).toHaveAttribute('href', '/help');
    expect(screen.getByRole('link', {name: 'About the project'})).toHaveAttribute('href', '/about');
  });

  it('shows the current version and links to what is new', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(new RegExp(`Version ${version.replace(/\./g, '\\.')}\\.`))).toBeInTheDocument();
    expect(screen.getByRole('link', {name: "See what's new"})).toHaveAttribute('href', '/release-notes');
  });
});

describe('ReleaseNotes', () => {
  it('renders every release_notes file, newest first', () => {
    renderWithProviders(<ReleaseNotes />);
    const expected = readdirSync('release_notes')
      .filter((f) => /^v\d+\.\d+\.\d+\.md$/.test(f))
      .map((f) => f.slice(0, -3))
      .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));
    const rendered = [...document.querySelectorAll('.release-notes h1')].map((h) => h.textContent);
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered).toEqual(expected);
    expect(screen.getAllByText(/^Released \d{4}-\d{2}-\d{2}\.$/)).toHaveLength(expected.length);
  });
});

describe('About', () => {
  it('shows the current version and links to the release notes', () => {
    renderWithProviders(<About />);
    expect(screen.getByText(version, {selector: 'strong'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'release notes'})).toHaveAttribute('href', '/release-notes');
  });

  it('links each experiment to its page', () => {
    renderWithProviders(<About />);
    for (const [name, href] of [
      ['Modal Example', '/modal-example'],
      ['One - Colour Picker', '/one'],
      ['Two - The React Counter', '/two'],
    ]) {
      expect(screen.getByRole('link', {name})).toHaveAttribute('href', href);
    }
  });

  it('lists the stack with major versions from package.json', () => {
    renderWithProviders(<About />);
    const reactRow = screen.getByRole('link', {name: 'React'}).closest('tr')!;
    expect(within(reactRow).getByRole('rowheader')).toHaveTextContent(`React ${/\d+/.exec(dependencies.react)![0]}`);
  });

  it('opens external links in a new tab', () => {
    renderWithProviders(<About />);
    const external = screen.getAllByRole('link').filter((a) => a.getAttribute('href')!.startsWith('http'));
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    }
  });
});

describe('Help', () => {
  it('lists only commands that exist in package.json', () => {
    renderWithProviders(<Help />);
    const commands = [...document.querySelectorAll('.info-table th code')].map((c) => c.textContent!);
    expect(commands.length).toBeGreaterThan(0);
    for (const command of commands) {
      const script = /^npm (?:run )?([\w:-]+)/.exec(command)?.[1];
      expect(Object.keys(scripts), command).toContain(script);
    }
  });

  it('links to the other help pages', () => {
    renderWithProviders(<Help />);
    for (const link of screen.getAllByRole('link', {name: 'About'})) {
      expect(link).toHaveAttribute('href', '/about');
    }
    for (const link of screen.getAllByRole('link', {name: 'release notes'})) {
      expect(link).toHaveAttribute('href', '/release-notes');
    }
  });

  it('points at the env template that exists', () => {
    renderWithProviders(<Help />);
    expect(screen.getByText('setup/env.template')).toBeInTheDocument();
    expect(existsSync('setup/env.template')).toBe(true);
  });
});

describe('Two', () => {
  it('shows the working counter', () => {
    renderWithProviders(<Two />);
    expect(screen.getByRole('heading', {name: 'The React Counter', level: 1})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Increment value'})).toBeInTheDocument();
  });

  it('explains only buttons that the counter really has', () => {
    renderWithProviders(<Two />);
    const explained = [...document.querySelectorAll('.info-table th')]
      .map((th) => th.textContent!)
      .filter((label) => !label.startsWith('src/'));
    expect(explained).toEqual(['- and +', 'Add Amount', 'Add Async', 'Add If Odd']);
    for (const label of explained.slice(1)) {
      expect(screen.getByRole('button', {name: label})).toBeInTheDocument();
    }
  });

  it('points at code files that exist', () => {
    renderWithProviders(<Two />);
    const paths = [...document.querySelectorAll('.info-table th code')].map((c) => c.textContent!);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) expect(existsSync(path), path).toBe(true);
  });
});

describe('One', () => {
  it('describes each of the eight pickers', () => {
    renderWithProviders(<One />);
    const names = screen.getAllByRole('heading', {level: 3}).map((h) => h.textContent);
    expect(names).toEqual(['Block', 'Chrome', 'Circle', 'Github', 'Hue', 'Photoshop', 'Sketch', 'Twitter'].map((n) => `${n} Picker`));
    for (const section of document.querySelectorAll('.colour-picker')) {
      expect(section.querySelector('p')!.textContent!.length).toBeGreaterThan(10);
    }
  });

  it('shows the chosen colour and applies it to the page', async () => {
    const {user} = renderWithProviders(<One />);
    expect(screen.getByText('#ffffff', {selector: 'code'})).toBeInTheDocument();
    await user.click(document.querySelector('div[title="#f44336"]')!);
    expect(await screen.findByText('#f44336', {selector: 'code'})).toBeInTheDocument();
    expect(document.querySelector<HTMLElement>('.colour-page')!.style.background).toBe('rgb(244, 67, 54)');
  });
});
