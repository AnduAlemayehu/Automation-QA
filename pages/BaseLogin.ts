import { Page, Locator, expect } from '@playwright/test';

export type Platform = 'desktop' | 'mobile';

export class BaseLogin {
  readonly username: Locator;
  readonly password: Locator;
  readonly desktopSubmitBtn: Locator;
  readonly mobileSubmitBtn: Locator;

  constructor(private page: Page, private platform: Platform) {
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });

    // Desktop submit
    this.desktopSubmitBtn = page.getByRole('button', { name: 'Sign in' });

    // Mobile submit
    this.mobileSubmitBtn = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
  }

  async login(username: string, password: string) {
    await this.username.waitFor({ timeout: 30000 });
    await this.username.fill(username);
    await this.password.fill(password);

    if (this.platform === 'desktop') {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.desktopSubmitBtn.click(),
      ]);
    } else {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.mobileSubmitBtn.click(),
      ]);
    }

    // Safety check
    await expect(this.page).not.toHaveURL(/login/i);
  }
}
