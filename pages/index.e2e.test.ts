import puppeteer from 'puppeteer';

describe('index.tsx', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    page.on('console', async (evt) => {
      const args = await Promise.all(evt.args().map((arg) => arg.jsonValue()));
      const type = evt.type();
      const concatMessage = args
        .map((arg) => {
          if (arg instanceof Error) return arg.message;
          return arg;
        })
        .join();
      if (type === 'error') {
        throw new Error(
          `Failing due to console.${type} while running test!\n\n${concatMessage})}`
        );
      }
    });
  });

  it('test #PageTitle is correct', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('#PageTitle');
    const text = await page.$eval('#PageTitle', (e) => e.textContent);
    expect(text).toContain('Products');
  });

  afterAll(() => {
    browser.close();
  });
});
