import { Page, Locator, expect } from '@playwright/test';

export class MobileChangePasswordPage {
  private page: Page;

  private menuButton: Locator;
  private changePasswordMenuItem: Locator;

  private oldPasswordInput: Locator;
  private newPasswordInput: Locator;
  private confirmPasswordInput: Locator;

  private saveButton: Locator;
  private successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.getByRole('button', { name: 'menu' });
    this.changePasswordMenuItem = page.getByText('Change Password');

    // ⚠️ Replace with data-testid if available (recommended)
    this.oldPasswordInput = page.locator('#ion-input-0');
    this.newPasswordInput = page.locator('#ion-input-1');
    this.confirmPasswordInput = page.locator('#ion-input-2');

    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.successToast = page.getByText(
      /password changed successfully|updated/i
    );
  }

  async open() {
    await this.menuButton.click();
    await this.changePasswordMenuItem.click();
  }

  async changePassword(oldPassword: string, newPassword: string) {
    await this.oldPasswordInput.fill(oldPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.saveButton.click();
  }

  async verifyPasswordChanged() {
    await expect(this.successToast).toBeVisible();
  }
}
