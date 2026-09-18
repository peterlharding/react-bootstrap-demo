import {readdirSync} from 'node:fs';

import {expect, test} from './fixtures';

test('release notes list every version newest first', async ({page}) => {
  const expected = readdirSync('release_notes')
    .filter((f) => /^v\d+\.\d+\.\d+\.md$/.test(f))
    .map((f) => f.slice(0, -3))
    .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));

  await page.goto('/release-notes');
  await expect(page.locator('.release-notes h1')).toHaveText(expected);
  await expect(page.locator('.release-notes ul').first()).toHaveCSS('list-style-type', 'disc');
});
