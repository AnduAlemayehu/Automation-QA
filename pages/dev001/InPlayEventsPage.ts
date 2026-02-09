import { Page, Locator, expect } from '@playwright/test';

export class InPlayEventsPage {
  private page: Page;
  private inplayContainer: Locator;
  private inplayEvents: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inplayContainer = page.locator('mat-drawer-content.mat-drawer-content.content-wrapper.shrunk-right.shrunk-left')
    this.inplayEvents = page.locator('tr td:first-child a');
    
  }

  /**
   * Opens Inplay page and logs time taken
   * until at least one event is displayed
   */
  async openAndMeasureLoadTime() {
    

    await this.page.getByRole('link', { name: 'In-Play', exact: true }).click();
    const startTime = Date.now();
    await expect(this.inplayEvents.first()).toBeVisible();

    // Wait until at least one inplay event appears
    await expect.poll(
      async () => await this.inplayEvents.first().count(),
      {
        timeout: 15_000, // max wait (not an SLA assertion)
        intervals: [500],
      }
    ).toBeGreaterThan(0);

    const endTime = Date.now();
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`⏱ Inplay events loaded in ${loadTimeSeconds} seconds`);

    return Number(loadTimeSeconds);
  }
}
