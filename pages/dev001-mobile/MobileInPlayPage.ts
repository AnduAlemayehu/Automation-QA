import { Page, Locator, expect } from '@playwright/test';

export class MobileInPlayPage {
  private page: Page;

  private firstOdd: Locator;
  private stakeInput: Locator;
  private placeBetButton: Locator;
  private successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstOdd = page.getByRole('button').filter({
      hasText: /^[0-9.]+$/,
    }).first();

    this.stakeInput = page.getByPlaceholder('Stake');
    this.placeBetButton = page.getByRole('button', { name: 'Place Bet' });

    this.successToast = page.locator('text=/success|matched|placed/i');
  }

  async getOddValue(): Promise<string> {
    return (await this.firstOdd.innerText()).trim();
  }

  async clickOdd() {
    await this.firstOdd.click();
  }

  async placeBet(stake: string) {
    await this.stakeInput.fill(stake);
    await this.placeBetButton.click();
  }

  async waitForSuccess() {
    await expect(this.successToast.first()).toBeVisible({ timeout: 10000 });
  }
}
