import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submitBtn: Locator;

  constructor(private page: Page) {
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.submitBtn = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillCredentials(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
  }

  async submit() {
    await this.submitBtn.click();
  }
}
