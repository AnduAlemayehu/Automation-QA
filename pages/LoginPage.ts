import { Page, Locator } from '@playwright/test';

export class LoginPage {
  username: Locator;
  password: Locator;
  submitBtn: Locator;

constructor(private page: Page) {
    this.username = this.page.getByRole('textbox', { name: 'Username' });
    this.password = this.page.getByRole('textbox', { name: 'Password' });
    this.submitBtn = this.page.getByRole('button', { name: 'Sign in' });
}

  async goto() {
    await this.page.goto('/');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submitBtn.click();
  }
}
