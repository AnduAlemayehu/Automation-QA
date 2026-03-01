import { Page, Locator, expect } from '@playwright/test';

export class MobileBetSlipPage {
  private page: Page;
  private firstRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstRow = page.locator('table tbody tr').first();
  }

  async openMyBets() {
    await this.page.getByText('My Bets').click();
  }

  async getLatestBetData() {
    const row = this.firstRow;
    const betId = await row.locator('td').nth(0).innerText();
    const description = await row.locator('td').nth(2).innerText();
    const type = await row.locator('td').nth(3).innerText();
    const odds = await row.locator('td').nth(5).innerText();
    const price = await row.locator('td').nth(6).innerText();
    const stake = await row.locator('td').nth(7).innerText();
    const profit = await row.locator('td').nth(8).innerText();
    const status = await row.locator('td').nth(9).innerText();

    return {
      betId: betId.trim(),
      description: description.trim(),
      type: type.trim(),
      odds: odds.trim(),
      price: price.trim(),
      stake: stake.trim(),
      profit: profit.trim(),
      status: status.trim(),
    };
  }

  async verifyRowVisible() {
    await expect(this.firstRow).toBeVisible();
  }
}
