import { Page, expect } from '@playwright/test';

export class HomeNavigationPage {

  private consoleErrors: string[] = [];

  constructor(private page: Page) {}

  captureConsoleErrors() {
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  async testMainMenus() {

    console.log('\n🔹 Testing Main Menu Navigation');

    const mainMenus = [
      { role: 'link', name: 'Home', exact: false },
      { role: 'text', name: 'Casino' },
      { role: 'link', name: 'In-Play', exact: true },
      { role: 'link', name: 'My Markets' },
    ];

    for (const menu of mainMenus) {

      const start = performance.now();

      if (menu.role === 'text') {
        await this.page.getByText(menu.name!).click();
      } else {
        await this.page.getByRole(menu.role as any, {
          name: menu.name,
          exact: menu.exact ?? false,
        }).click();
      }

      await this.page.waitForLoadState('networkidle');

      const end = performance.now();
      const loadTime = ((end - start) / 1000).toFixed(2);

      console.log(`⏱ ${menu.name} loaded in ${loadTime}s`);

      expect(Number(loadTime)).toBeLessThanOrEqual(2);
    }
  }

  async testHeaderSports() {

    console.log('\n🔹 Testing Header Sports Navigation');

    const headerSports = ['Soccer', 'Cricket', 'Tennis'];

    for (const sport of headerSports) {

      const start = performance.now();

      await this.page.locator('app-header')
        .getByRole('link', { name: sport })
        .click();

      await this.page.waitForTimeout(500);

      const end = performance.now();
      const loadTime = ((end - start) / 1000).toFixed(2);

      console.log(`⏱ Header ${sport} switched in ${loadTime}s`);
    }
  }

  async testHighlightTabs() {

    console.log('\n🔹 Testing Highlight Tabs');

    await this.page.getByRole('link', { name: 'Home' }).click();

    const highlightTabs = ['Cricket', 'Soccer', 'Tennis'];

    for (const tab of highlightTabs) {

      const start = performance.now();

      await this.page.getByRole('tab', { name: tab }).click();
      await this.page.waitForTimeout(500);

      const end = performance.now();
      const loadTime = ((end - start) / 1000).toFixed(2);

      console.log(`⏱ Highlight ${tab} switched in ${loadTime}s`);
    }
  }

  async verifyNoConsoleErrors() {
    expect(
      this.consoleErrors,
      `Console errors detected:\n${this.consoleErrors.join('\n')}`
    ).toHaveLength(0);
  }
}