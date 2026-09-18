import {expect, test as base, type Page} from '@playwright/test';

// Every test fails if the page logs a console error or warning, or throws.
export const test = base.extend<{consoleProblems: string[]}>({
  consoleProblems: [async ({page}, provide) => {
    const problems: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') problems.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
    await provide(problems);
    expect(problems, 'console errors or warnings').toEqual([]);
  }, {auto: true}],
});

export {expect};

// Marks the window so a full page reload (instead of client-side routing) can be detected.
export const markDocument = (page: Page) =>
  page.evaluate(() => { (window as unknown as {__spa: boolean}).__spa = true; });

export const isSameDocument = (page: Page) =>
  page.evaluate(() => (window as unknown as {__spa?: boolean}).__spa === true);
