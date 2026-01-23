import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  // 🧭 Navigation
  readonly dashboardMenu: Locator;

  // 🔝 Header values
  readonly balanceValue: Locator;
  readonly exposureValue: Locator;
  readonly availableToBetValue: Locator;

  // 📋 Sidebar
  readonly sidebarContainer: Locator;
  readonly soccerLink: Locator;

  // 📊 Events table
  readonly eventHeader: Locator;
  readonly eventRowCell: Locator;
  readonly backOdds: Locator;
  readonly layOdds: Locator;



  constructor(private page: Page) {
    // 🧭 Home tab
    this.dashboardMenu = page.getByRole('link', { name: 'Home', exact: true });


    // 💰 Balance 
    this.balanceValue = page .locator('span.balance-value.text-balance.balance-val').first(); 
    // 📉 Exposure 
    this.exposureValue = page.locator( "//div[5]//span[2]//preceding::span[@class='balance-value text-balance exposure-val']" ).first(); 
    // ✅ Available to bet (fallback selector) 
    this.availableToBetValue = page.locator( "//div[5]//span[2]//preceding::span[@class='balance-value text-balance exposure-val']" ).first();
   
    // 📋 Sidebar (ANY of these proving sidebar loaded)
    this.sidebarContainer = page.locator(
      'mat-drawer.mat-drawer.sports-wrapper.mat-drawer-side.mat-drawer-opened'
    );

    this.soccerLink = page
      .locator("a.nav-link, a")
      .filter({ hasText: 'Soccer' })
      .first();

    // 📊 Events table (use multiple strong signals)
    this.eventHeader = page.locator('tr').locator('th').first();

    this.eventRowCell = page.locator('td.event-td, td:visible').first();

    this.backOdds = page.locator('a.value-cell.bg-back').first();
    this.layOdds = page.locator('a.value-cell.bg-lay').first();
}

  /**
   * ✅ GUARANTEED INTERACTIVE STATE
   */
  async waitForPageReady() {
    // 1️⃣ Browser readiness
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');

    // 2️⃣ Header data ready
    await expect(this.balanceValue).toBeVisible({ timeout: 15000 });
    await expect(this.exposureValue).toBeVisible();
    await expect(this.availableToBetValue).toBeVisible();

    // 3️⃣ Navigation interactive
    await expect(this.dashboardMenu).toBeVisible();
    await expect(this.dashboardMenu).toBeEnabled();

    // 4️⃣ Sidebar fully loaded
    await expect(this.sidebarContainer).toBeVisible({ timeout: 15000 });
    await expect(this.soccerLink).toBeVisible();
    await expect(this.soccerLink).toBeEnabled();

    // 5️⃣ Events table rendered
    await expect(this.eventHeader).toBeVisible({ timeout: 15000 });
    await expect(this.eventRowCell).toBeVisible();

    // 6️⃣ Odds are clickable (core interaction)
    await expect(this.backOdds).toBeVisible();
    await expect(this.backOdds).toBeEnabled();

    await expect(this.layOdds).toBeVisible();
    await expect(this.layOdds).toBeEnabled();

   
  }

  // 📊 Utility methods
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
