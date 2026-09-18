import {expect, test} from './fixtures';

test('Redux counter works and survives navigation', async ({page}) => {
  await page.goto('/two');
  const value = page.getByRole('button', {name: 'Decrement value'}).locator('+ span');

  await page.getByRole('button', {name: 'Increment value'}).click();
  await page.getByRole('button', {name: 'Increment value'}).click();
  await page.getByRole('button', {name: 'Decrement value'}).click();
  await expect(value).toHaveText('1');

  await page.getByRole('button', {name: 'Add Amount'}).click();
  await expect(value).toHaveText('3');

  await page.getByRole('button', {name: 'Add If Odd'}).click();
  await expect(value).toHaveText('5');

  await page.getByRole('button', {name: 'Add Async'}).click();
  await expect(value).toHaveText('7');

  await page.locator('.header-footer-layout-footer').getByRole('link', {name: 'Help'}).click();
  await page.goBack();
  await expect(value).toHaveText('7');
});
