import {expect, test} from './fixtures';

test('modal opens on load, closes and reopens', async ({page}) => {
  await page.goto('/modal-example');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', {name: 'Close'}).first().click();
  await expect(dialog).toBeHidden();

  await page.getByRole('button', {name: 'Launch demo modal'}).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', {name: 'Save Changes'}).click();
  await expect(dialog).toBeHidden();
});
