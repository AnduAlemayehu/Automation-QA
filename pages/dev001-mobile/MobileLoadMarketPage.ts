import { Page, Locator } from '@playwright/test';

export class MobileLoadMarketPage {
  private page: Page;
  private noEventsText: Locator;
  private inplayEvents: Locator;
  private marketContainer: Locator;
  private backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // InPlay
    this.noEventsText = page.getByText('No events Found');
    this.inplayEvents = page.locator('div.primary-bottom-bordered');

    // Market page (adjust if needed)
    this.marketContainer = page.locator('.odds-row-container');

    // Back button (adjust selector if needed)
    this.backButton = page.locator('ion-back-button, button:has-text("Back")');
  }

  // =============================
  // 1️⃣ INPLAY SPEED
  // =============================
  async openAndMeasureLoadTime() {
    const sportsLocators = [
      this.page.locator('div').filter({ hasText: 'Horse' }).nth(3),
      this.page.locator('div').filter({ hasText: 'Greyhound' }).nth(3),
      this.page.locator('div').filter({ hasText: 'Horse' }).nth(3),
      this.page.locator('div').filter({ hasText: /^Tennis$/ }),
      this.page.locator('div').filter({ hasText: /^Soccer$/ }),
      this.page.locator('div').filter({ hasText: /^Cricket$/ }),
    ];

    const startTime = Date.now();

    for (const sportLocator of sportsLocators) {
      await sportLocator.click();
      await this.page.getByRole('button', { name: 'In Play' }).click();

      let eventsFound: string[] | null = null;
      const timeout = 10000;
      const interval = 500;
      const startPoll = Date.now();

      while (Date.now() - startPoll < timeout) {
        const count = await this.inplayEvents.count();

        if (count > 0) {
          eventsFound = await this.inplayEvents.allTextContents();
          break;
        }

        if (await this.noEventsText.isVisible()) {
          eventsFound = [];
          break;
        }

        await new Promise(res => setTimeout(res, interval));
      }

      if (eventsFound && eventsFound.length > 0) {
        const endTime = Date.now();
        const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`⏱ InPlay loaded in ${loadTimeSeconds} seconds`);

        return {
          loadTime: Number(loadTimeSeconds),
          events: eventsFound,
        };
      }
    }

    const endTime = Date.now();
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`⏱ No InPlay events found after ${loadTimeSeconds} seconds`);

    return {
      loadTime: Number(loadTimeSeconds),
      events: [],
    };
  }

  // =============================
  // 2️⃣ MARKET SPEED
  // =============================
  async measureMarketLoadTime() {
    const startTime = Date.now();

    // Click first event
    await this.inplayEvents.first().click();

    const timeout = 10000;
    const interval = 500;
    const startPoll = Date.now();

    while (Date.now() - startPoll < timeout) {
      const count = await this.marketContainer.count();
      if (count > 0) break;

      await new Promise(res => setTimeout(res, interval));
    }

    const endTime = Date.now();
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`⚡ Market loaded in ${loadTimeSeconds} seconds`);

    return Number(loadTimeSeconds);
  }

 
}
