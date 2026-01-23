import { Page } from '@playwright/test';

export class InPlayPage {
  constructor(private page: Page) {}

  async openInPlay() {
    await this.page.getByRole('link', { name: 'In-Play', exact: true }).click();
  }

  async clickOddToOpenBetSlip() {
    await this.page
      .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title')
      .locator('span')
      .nth(1)
      .click();
  }
}
