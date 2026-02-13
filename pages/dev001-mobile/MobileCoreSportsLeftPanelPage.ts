import { Page, Locator, expect } from "@playwright/test";

export class MobileCoreSportsMenuPage {
  private page: Page;

  private menuButton: Locator;
  private mobileMenu: Locator;
  private cointaner: Locator;

  constructor(page: Page) {
    this.page = page;

    // Hamburger menu button
    this.menuButton = page.getByRole("button", { name: "menu" });

    // Ionic menu container
    this.mobileMenu = page.locator("ion-menu");
    //cointaner for sports list
    this.cointaner = page.locator("div.w-full.h-full.overflow-y-scroll.p-2");
  }

  async openMenu() {
    if (!(await this.mobileMenu.isVisible().catch(() => false))) {
      await this.menuButton.click();
      await expect(this.mobileMenu).toBeVisible();
      const sportsMenuToggle = this.page
        .locator("ion-menu")
        .locator("ion-menu-toggle")
        .filter({ hasText: "Sports" });

      await expect(sportsMenuToggle).toBeVisible();
      await sportsMenuToggle.click();
    }
  }

  async verifyCoreSportsDisplayed(expectedSports: string[]) {
    const missingSports: string[] = [];

    await this.openMenu();
    await this.page.waitForTimeout(500);
    for (const sport of expectedSports) {
      let sportLocator: Locator | undefined;
      // console.log(sport + ' count: ' + await this.page.getByRole('main').getByText(sport).count());
console.log(sport + ' count: ' + await this.page.getByRole('main').getByText(sport, { exact: true }).count());
      if (sport === "Horse Racing" || sport === "Greyhound Racing") {
        sportLocator = this.page
         .getByRole('main')
          .getByText(sport, { exact: true });
      } else if (sport === "Cricket" || sport === "Tennis" || sport === "Basketball") {
        sportLocator = this.page.getByRole('main').getByText(sport);
      } else if (sport === "Soccer") {
        sportLocator = this.page
          .getByRole('main')
          .getByText(sport, { exact: true })
          .first();
      }

      // 🔥 SAFETY FIX
      if (!sportLocator) {
        missingSports.push(sport);
        continue;
      }

      const isVisible = await sportLocator.isVisible().catch(() => false);

      if (isVisible) {
        console.log(`✅ Verified presence of sport: ${sport}`);
      } else {
        missingSports.push(sport);
      }
    }

    if (missingSports.length > 0) {
      const missingLabel = missingSports.join("-").replace(/\s+/g, "_");

      // await this.page.screenshot({
      //   path: `screenshots/mobile-missing-core-sports-${missingLabel}.png`,
      //   fullPage: true,
      // });

      throw new Error(
        `❌ Missing core sports in mobile menu: ${missingSports.join(", ")}`,
      );
    }

    console.log("🎯 All core sports verified in mobile menu");
  }
}
