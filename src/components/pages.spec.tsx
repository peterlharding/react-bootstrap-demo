import {readdirSync} from 'node:fs';

import {screen} from '@testing-library/react';

import {renderWithProviders} from '../test/render';
import About from './About';
import Help from './Help';
import Home from './Home';
import ReleaseNotes from './ReleaseNotes';

// React 19 ignores function-component defaultProps, which react-lorem-ipsum relies on.
// Without explicit props the pages render the same fixed paragraph five times.
describe.each([
  ['Home', Home],
  ['Help', Help],
  ['About', About],
])('%s lorem ipsum', (_name, Page) => {
  it('renders five distinct random paragraphs', () => {
    renderWithProviders(<Page />);
    const paragraphs = [...document.querySelectorAll('.text-wrapper p')].map((p) => p.textContent);
    expect(paragraphs).toHaveLength(5);
    expect(new Set(paragraphs).size).toBe(5);
    expect(paragraphs[0]).toMatch(/^Lorem ipsum odor amet/);
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
