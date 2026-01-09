import { Page, Locator, expect } from '@playwright/test';

export class BetSlipPage {
  readonly page: Page;
  readonly backOdds: Locator;
  readonly stakeInput: Locator;
  readonly placeBetBtn: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;

  constructor(page: Page) {
    this.page = page;

    // Keep your original locator
    this.backOdds = page
      .locator('table tbody tr')
      .first()
      .locator('td a')
      .first();

    this.stakeInput = page.getByRole('textbox', { name: /stake/i });
    this.placeBetBtn = page.getByRole('button', { name: 'Place Bet' });

    this.successToast = page.locator('text=/submitted|success|placed/i');
    this.errorToast = page.locator('text=/error|failed|suspended|rejected/i');
  }

  // Open BetSlip safely
  async openBetSlip(): Promise<boolean> {
    await expect(this.backOdds).toBeVisible({ timeout: 30000 });

    // Get trimmed odds text
    const oddsText = (await this.backOdds.innerText()).trim();

    if (!oddsText || oddsText === '0' || oddsText === '-') {
      console.warn(`⚠️ Cannot click back odds: invalid value "${oddsText}"`);
      return false; // skip click
    }

    await this.backOdds.click();
    return true;
  }

  async placeBet(stake: string) {
    await expect(this.stakeInput).toBeVisible({ timeout: 30000 });
    await this.stakeInput.fill(stake);
    await expect(this.placeBetBtn).toBeEnabled();
    await this.placeBetBtn.click();
  }

  async waitForToast(): Promise<'SUCCESS' | 'ERROR' | 'NONE'> {
    try {
      await Promise.race([
        this.successToast.first().waitFor({ timeout: 8000 }),
        this.errorToast.first().waitFor({ timeout: 8000 }),
      ]);

      if (await this.successToast.first().isVisible()) return 'SUCCESS';
      if (await this.errorToast.first().isVisible()) return 'ERROR';

      return 'NONE';
    } catch {
      return 'NONE';
    }
  }
}
