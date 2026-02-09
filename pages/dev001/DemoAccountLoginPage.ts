import { Page, Locator, expect } from '@playwright/test';

export class DemoAccountLoginPage {
  private page: Page;

  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private homePageIdentifier: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    // Desktop submit
    this.loginButton = page.getByRole('button', { name: 'Sign in' });

// 🧭 Home tab
    this.homePageIdentifier = page.getByRole('link', { name: 'Home', exact: true });
  
    this.errorMessage =  page.locator(':text-is("Invalid Credentials")');
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.homePageIdentifier).toBeVisible();
  }

  async verifyLoginFailure() {
    await expect(this.errorMessage).toBeVisible();
  }
}
