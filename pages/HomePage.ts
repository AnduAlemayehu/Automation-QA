import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly dashboardMenu: Locator;
  readonly exposureValue: Locator;

  constructor(private page: Page) {
    // ✅ Dashboard visible indicator
    this.dashboardMenu = page.getByRole('link', { name: 'Home', exact: true });

    // ✅ Take the first exposure value
    this.exposureValue = page.locator('.exposure-val').first();
  }

  async waitForDashboard() {
    await expect(this.dashboardMenu).toBeVisible({ timeout: 10000 });
  }

  async getExposure(): Promise<string> {
    await expect.poll(async () => {
      const value = (await this.exposureValue.innerText())
        .replace(/\u00a0/g, '')
        .trim();
      return value;
    }).not.toBe('');

    return (await this.exposureValue.innerText())
      .replace(/\u00a0/g, '')
      .trim();
  }
}
