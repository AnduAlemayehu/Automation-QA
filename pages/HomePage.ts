import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly dashboardMenu: Locator;
  readonly balanceValue: Locator;
  readonly exposureValue: Locator;
  readonly availableToBetValue: Locator;

  constructor(private page: Page) {
    // Dashboard indicator
    this.dashboardMenu = page.getByRole('link', { name: 'Home', exact: true });

   
    // 💰 Balance
    this.balanceValue = page.locator(
      'span.balance-value.text-balance.balance-val'
    ).first();

    // 📉 Exposure
    this.exposureValue = page.locator(
      "//div[5]//span[2]//preceding::span[@class='balance-value text-balance exposure-val']"
    ).first();

    // ✅ Available to bet (fallback selector)
    this.availableToBetValue = page.locator(
      "//div[5]//span[2]//preceding::span[@class='balance-value text-balance exposure-val']"
    ).first();
    
  }

  async waitForDashboard() {
    await expect(this.dashboardMenu).toBeVisible({ timeout: 10000 });
  }

  async getBalance(): Promise<number> {
    const text = await this.balanceValue.innerText();
    return Number(text.replace(/[^\d.]/g, ''));
  }

  async getExposure(): Promise<string> {
    return (await this.exposureValue.innerText())
      .replace(/\u00a0/g, '')
      .trim();
  }

  async getAvailableToBet(): Promise<number> {
    const text = await this.availableToBetValue.innerText();
    return Number(text.replace(/[^\d.]/g, ''));
  }
}
