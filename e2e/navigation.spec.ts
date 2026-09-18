import {expect, isSameDocument, markDocument, test} from './fixtures';

const heading = (page: import('@playwright/test').Page) =>
  page.locator('.header-footer-layout-body h1').first();

test('root path renders Home', async ({page}) => {
  await page.goto('/');
  await expect(heading(page)).toHaveText('React Bootstrap Demo');
});

test('deep links load directly', async ({page}) => {
  await page.goto('/two');
  await expect(heading(page)).toHaveText('Two works!');
});

test('navbar dropdown navigates client-side and marks the item active', async ({page}) => {
  await page.goto('/home');
  await markDocument(page);
  await page.getByRole('button', {name: 'Experimental'}).click();
  await page.getByRole('link', {name: 'Two - The React Counter'}).click();
  await expect(page).toHaveURL('/two');
  await expect(heading(page)).toHaveText('Two works!');
  expect(await isSameDocument(page)).toBe(true);

  await page.getByRole('button', {name: 'Experimental'}).click();
  await expect(page.getByRole('link', {name: 'Two - The React Counter'})).toHaveClass(/active/);
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
  await expect(heading(page)).toHaveText('Help for Starter');
  await page.goBack();
  await expect(page).toHaveURL('/two');
  await expect(heading(page)).toHaveText('Two works!');
});

test('lorem ipsum pages render five distinct paragraphs', async ({page}) => {
  for (const path of ['/home', '/help', '/about']) {
    await page.goto(path);
    const paragraphs = await page.locator('.text-wrapper p').allTextContents();
    expect(paragraphs, path).toHaveLength(5);
    expect(new Set(paragraphs).size, path).toBe(5);
    expect(paragraphs[0], path).toMatch(/^Lorem ipsum odor amet/);
  }
});
