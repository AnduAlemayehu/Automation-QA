import { Page, Locator, expect } from '@playwright/test';

export class LoadMarketPage {
  private page: Page;

//   private marketContainer: Locator;
  private marketItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.marketContainer = page.getByTestId('market-page');
    this.marketItems = page.locator('tr.market-runner-row').locator('td');
  }

  /**
   * Opens Market page and measures time
   * until at least one market item is displayed
   */
  async openAndMeasureMarketLoadTime() {
    // const startTime = Date.now();

    await this.page.locator('tr td:first-child a').first().click();
    const startTime = Date.now();
    await expect(this.marketItems.nth(0)).toBeVisible();

    await expect.poll(
      async () => await this.marketItems.count(),
      {
        timeout: 15_000,
        intervals: [500],
      }
    ).toBeGreaterThan(0);

    const endTime = Date.now();
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`⏱ Market page loaded in ${loadTimeSeconds} seconds`);

    return Number(loadTimeSeconds);
  }
}
