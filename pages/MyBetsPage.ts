import { Page, expect } from '@playwright/test';

export class MyBetsPage {
  constructor(private page: Page) {}

  async openMyBets() {
    await this.page.locator('button.mat-mdc-menu-trigger.user-btn').click();
    await this.page.getByText('My Bets', { exact: true }).click();

    await this.page
      .locator("//mat-select[@id='mat-select-1']//div[@class='mat-mdc-select-arrow']//*[name()='svg']")
      .click();

    await this.page.locator('mat-option:has-text("Current Bets")').click();
  }

  async getMyBetsValues(betId: string) {
    // const row = this.page.locator(`tr.bet-item:has-text("${betId}")`);
    const row = this.page.locator(`tr.bet-item:has-text("")`).first();
    await expect(row).toBeVisible({ timeout: 10000 });

    const myBetsId = await row.locator('td').nth(0).innerText();
    const myBetsSelectionName = await row.locator('td').nth(2).locator('a').innerText();
    const myBetsOdds = await row.locator('td').nth(5).innerText();
    const myBetsStake = await row.locator('td').nth(7).innerText();

    return {
      myBetsId,
      myBetsSelectionName,
      myBetsOdds,
      myBetsStake,
    };
  }
}
