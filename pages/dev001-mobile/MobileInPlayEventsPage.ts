import { Page, Locator, expect } from '@playwright/test';

export class MobileInPlayEventsPage {
  private page: Page;
  private noEventsText: Locator;
  private inplayEvents: Locator;

  constructor(page: Page) {
    this.page = page;
    this.noEventsText = page.getByText('No events Found');
    this.inplayEvents = page.locator('div.primary-bottom-bordered');
  }

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

      // Poll until events appear or "No events Found"
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
        console.log(`⏱ Inplay events loaded in ${loadTimeSeconds} seconds`);
        return {
          loadTime: Number(loadTimeSeconds),
          events: eventsFound,
        };
      } else {
        console.log('No events found for this sport, trying next...');
      }
    }

    const endTime = Date.now();
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱ No inplay events found after trying all sports in ${loadTimeSeconds} seconds`);
    return {
      loadTime: Number(loadTimeSeconds),
      events: [],
      message: 'No events Found for all sports',
    };
  }
}
