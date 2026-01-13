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
  try {
    // Use isVisible() instead of expect().toBeVisible() to avoid throwing
    const isVisible = await this.backOdds.isVisible({ timeout: 60000 });
    
    // if (!isVisible) {
    //   console.log('Back odds not visible within timeout');
    //   return false;
    // }
    
    // Get trimmed odds text
    const oddsText = (await this.backOdds.innerText()).trim();
    console.log(`Back odds value: ${oddsText}`);
    
    if (!oddsText || oddsText === '0' || oddsText === '-') {
      console.log(`Cannot click back odds: invalid value "${oddsText}"`);
      return false; // skip click
    }
    
    await this.backOdds.click();
    console.log('Clicked back odds');
    return true;
    
  } catch (error) {
    // Catch any unexpected errors
    console.log(`Error in openBetSlip: `);
    return false;
  }
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
