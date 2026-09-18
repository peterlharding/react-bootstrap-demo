import {expect, test} from './fixtures';

test('all eight pickers render and a swatch click recolours the page', async ({page}) => {
  await page.goto('/one');
  const container = page.locator('.header-footer-layout-body .container');
  for (const name of ['Block', 'Chrome', 'Circle', 'Github', 'Hue', 'Photoshop', 'Sketch', 'Twitter']) {
    await expect(page.getByRole('heading', {name: `${name} Picker`})).toBeVisible();
  }
  await expect(container).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  await page.locator('div[title="#f44336"]').first().click();
  await expect(container).toHaveCSS('background-color', 'rgb(244, 67, 54)');
  await expect(page.locator('code', {hasText: /^#f44336$/})).toBeVisible();
  // Every picker is controlled by the same colour, so all their hex fields follow.
  const hexFields = page.locator('input');
  await expect.poll(async () => (await hexFields.evaluateAll((els) =>
    els.map((e) => (e as HTMLInputElement).value).filter((v) => /^#?[0-9a-f]{6}$/i.test(v))
      .map((v) => v.replace('#', '').toLowerCase())))).toEqual(Array(5).fill('f44336'));

  await page.locator('div[title="#D9E3F0"]').first().click();
  await expect(container).toHaveCSS('background-color', 'rgb(217, 227, 240)');
});
