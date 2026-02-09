import { Page, Locator, expect } from '@playwright/test';

export class CoreSportsLeftPanelPage {
  private page: Page;
  private leftPanelSports: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leftPanelSports = page.locator('aside.user-nav');
  }

  async verifyCoreSportsDisplayed(expectedSports: string[]) {
    const missingSports: string[] = [];

    for (const sport of expectedSports) {
      const sportLocator = this.leftPanelSports.locator(
        `:text-is("${sport}")`
      );

      const isVisible = await sportLocator.isVisible().catch(() => false);

      if (isVisible) {
        console.log(`Verified presence of sport: ${sport}`);
      } else {
        missingSports.push(sport);
      }
    }

    if (missingSports.length > 0) {
      const missingLabel = missingSports.join('-').replace(/\s+/g, '_');

      console.error(
        `❌ Missing core sports on left panel: ${missingSports.join(', ')}`
      );

      await this.page.screenshot({
        path: `screenshots/missing-core-sports-${missingLabel}.png`,
        fullPage: true,
      });

      throw new Error(
        `Core sports missing: ${missingSports.join(', ')}`
      );
    }

    await expect(this.leftPanelSports).toBeVisible();
  }
}
