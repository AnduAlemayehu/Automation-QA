import { Page, Locator, expect } from '@playwright/test';

export class ChangePasswordPage {
  private page: Page;

  private profileMenuButton: Locator;
  private changePasswordMenuItem: Locator;

  private oldPasswordInput: Locator;
  private newPasswordInput: Locator;
  private confirmPasswordInput: Locator;
  private changeButton: Locator;
  private successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profileMenuButton = page.getByRole('button').filter({ hasText: /^$/ });
    this.changePasswordMenuItem = page.getByRole('menuitem', {
      name: 'Change Password',
    });

    this.oldPasswordInput = page.getByRole('textbox', {
      name: 'Old Password',
    });
    this.newPasswordInput = page.getByRole('textbox', {
      name: 'New Password',
    });
    this.confirmPasswordInput = page.getByRole('textbox', {
      name: 'Confirm Password',
    });

    this.changeButton = page.getByRole('button', { name: 'Change' });

    this.successToast = page.getByText(
      /password changed successfully|updated/i
    );
  }

  async openChangePassword() {
    await this.profileMenuButton.click();
    await this.changePasswordMenuItem.click();
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ) {
    await this.oldPasswordInput.fill(oldPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.changeButton.click();
  }

  async verifyPasswordChanged() {
    await expect(this.successToast).toBeVisible();
  }
}
