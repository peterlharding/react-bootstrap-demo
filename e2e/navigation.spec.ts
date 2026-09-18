import {expect, isSameDocument, markDocument, test} from './fixtures';

const heading = (page: import('@playwright/test').Page) =>
  page.locator('.header-footer-layout-body h1').first();

test('root path renders the landing page', async ({page}) => {
  await page.goto('/');
  await expect(heading(page)).toHaveText('Sandpit');
});

test('deep links load directly', async ({page}) => {
  await page.goto('/two');
  await expect(heading(page)).toHaveText('Two works!');
});

test('navbar dropdown navigates client-side and marks the item active', async ({page}) => {
  await page.goto('/home');
  await markDocument(page);
  await page.getByRole('button', {name: 'Experimental'}).click();
  await page.locator('.navbar').getByRole('link', {name: 'Two - The React Counter'}).click();
  await expect(page).toHaveURL('/two');
  await expect(heading(page)).toHaveText('Two works!');
  expect(await isSameDocument(page)).toBe(true);

  await page.getByRole('button', {name: 'Experimental'}).click();
  await expect(page.locator('.navbar').getByRole('link', {name: 'Two - The React Counter'})).toHaveClass(/active/);
});

test('brand link navigates to /home client-side', async ({page}) => {
  await page.goto('/about');
  await markDocument(page);
  await page.locator('.navbar-brand').click();
  await expect(page).toHaveURL('/home');
  await expect(page.locator('.navbar').getByRole('link', {name: 'Home'})).toHaveClass(/active/);
  expect(await isSameDocument(page)).toBe(true);
});

test('footer links and the back button', async ({page}) => {
  await page.goto('/two');
  await page.locator('.header-footer-layout-footer').getByRole('link', {name: 'Help'}).click();
  await expect(heading(page)).toHaveText('Help');
  await page.goBack();
  await expect(page).toHaveURL('/two');
  await expect(heading(page)).toHaveText('Two works!');
});

test('landing page cards and buttons navigate client-side', async ({page}) => {
  await page.goto('/home');
  await markDocument(page);
  for (const [name, path, title] of [
    ['Modal Example', '/modal-example', null],
    ['One - Colour Picker', '/one', 'Working with Colour Pickers'],
    ['Two - The React Counter', '/two', 'Two works!'],
  ] as const) {
    // Click the middle of the card, not the link text: the stretched link makes the whole card clickable.
    await page.locator('.home-card', {hasText: name}).click();
    await expect(page).toHaveURL(path);
    if (title) await expect(heading(page)).toHaveText(title);
    await page.goBack();
  }
  await page.getByRole('link', {name: 'Get started'}).click();
  await expect(heading(page)).toHaveText('Help');
  expect(await isSameDocument(page)).toBe(true);
});
