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

  await page.locator('div[title="#D9E3F0"]').first().click();
  await expect(container).toHaveCSS('background-color', 'rgb(217, 227, 240)');
});
