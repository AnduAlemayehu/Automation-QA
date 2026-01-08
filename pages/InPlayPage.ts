import { Page, Locator, expect } from '@playwright/test';

export class InPlayPage {
  readonly page: Page;
  readonly inPlayTab: Locator;
  readonly firstOddsCell: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inPlayTab = page.getByRole('link', { name: 'In-Play', exact: true });

    this.firstOddsCell = page.locator(
      'xpath=//*[@id="mat-tab-nav-panel-1"]/app-in-play-markets/app-ip-market-item[2]/div[2]/table/tbody/tr[1]/td[3]'
    );
  }

  async openInPlay() {
    await this.inPlayTab.click();
  }

  async selectFirstMatchOdds() {
    await expect(this.firstOddsCell).toBeVisible({ timeout: 20000 });
    await this.firstOddsCell.click();
  }
}
