import { Page, Locator, expect } from '@playwright/test';

export class BetSlipPage {
  readonly page: Page;
  readonly stakeInput: Locator;
  readonly placeBetBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inspector-confirmed selector
    this.stakeInput = page.getByRole('textbox', { name: 'stake' });

    this.placeBetBtn = page.getByRole('button', { name: 'Place Bet' });
  }

  async waitForBetSlip() {
    await expect(this.stakeInput).toBeVisible({ timeout: 20000 });
  }

  async placeBet(stake: string) {
    await this.waitForBetSlip();
    await this.stakeInput.fill(stake);
    await expect(this.placeBetBtn).toBeEnabled();
    await this.placeBetBtn.click();
  }
}
