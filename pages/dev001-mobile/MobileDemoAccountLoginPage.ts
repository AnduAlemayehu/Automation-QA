import { Page, Locator, expect } from '@playwright/test';

export class MobileDemoAccountLoginPage {
  private page: Page;

  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private homePageIdentifier: Locator;
  private errorMessage: Locator;
  private myMarketsTab: Locator;
  private cricketTab: Locator;
  private inPlayTab: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    // Mobile submit
    this.loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });

// 🧭 Home tab
  // await page.getByRole('tab', { name: 'Home' }).click();
  // await page.getByRole('tab', { name: 'My Markets' }).click();
    this.homePageIdentifier = page.getByRole('tab', { name: 'Home' });
    this.myMarketsTab = page.getByRole('tab', { name: 'My Markets' });
    this.cricketTab = page.getByText('CRICKET');
    this.inPlayTab = page.getByText('In-Play').first();
  
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
  async verifyPageLoad() {
    await expect(this.myMarketsTab).toBeVisible();
    // await expect(this.cricketTab).toBeVisible();
    await expect(this.inPlayTab).toBeVisible();

  }
  

 

  async verifyLoginFailure() {
    await expect(this.errorMessage).toBeVisible();
  }
}
