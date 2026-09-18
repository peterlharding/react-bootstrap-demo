import {expect, test} from './fixtures';

const pages = ['/home', '/modal-example', '/one', '/two', '/help', '/release-notes', '/about'];
// Pages whose content is deliberately centred, so heading alignment does not apply.
const centred = new Set(['/home', '/modal-example']);

for (const width of [1280, 390]) {
  test.describe(`at ${width}px`, () => {
    test.use({viewport: {width, height: 900}});

    for (const path of pages) {
      test(`${path} fits the viewport and aligns its heading with the content`, async ({page}) => {
        await page.goto(path);
        await page.locator('.header-footer-layout-body .container').first().waitFor();

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth, 'no horizontal page scroll').toBeLessThanOrEqual(width);

        if (centred.has(path)) return;
        const [headingLeft, contentLeft] = await page.evaluate(() => {
          const textLeft = (el: Element) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            return Math.round([...range.getClientRects()].find((r) => r.width > 0)!.left);
          };
          const container = document.querySelector('.header-footer-layout-body .container')!;
          const padding = parseFloat(getComputedStyle(container).paddingLeft);
          return [textLeft(container.querySelector('h1')!), Math.round(container.getBoundingClientRect().left + padding)];
        });
        expect(headingLeft, 'heading starts where the content does').toBe(contentLeft);
      });
    }
  });
}
