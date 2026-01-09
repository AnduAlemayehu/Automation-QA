import { Page, Locator, expect, test } from '@playwright/test';

export class InPlayPage {
  readonly page: Page;
  readonly inPlayTab: Locator;
  readonly matchNames: Locator;
  readonly suspended: Locator;
  readonly closed: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inPlayTab = page.getByRole('link', { name: 'In-Play', exact: true });
    this.matchNames = page.locator('tr td:nth-child(1)').locator('span, a').first();


    this.suspended = page
      .getByLabel('Match Odds - Matched:')
      .locator('div')
      .filter({ hasText: /^Suspended$/ });

    this.closed = page
      .getByLabel('Match Odds - Matched:')
      .locator('div')
      .filter({ hasText: /^Closed$/ });
  }

  async openInPlay() {
    await this.inPlayTab.click();
    await expect(this.matchNames.first()).toBeVisible({ timeout: 20000 });
  }

  async openFirstMatchOrExit(): Promise<void> {
    if (await this.matchNames.count() === 0) {
      console.log('❌ No In-Play matches');
      test.skip(true, 'No matches available');
    }

    await this.matchNames.first().click();
    await this.page.waitForTimeout(500);

    if (await this.suspended.isVisible()) {
      console.log('⛔ Market SUSPENDED');
      test.skip(true, 'Market suspended');
    }

    if (await this.closed.isVisible()) {
      console.log('⛔ Market CLOSED');
      test.skip(true, 'Market closed');
    }

    console.log('✅ Market OPEN');
  }
}
