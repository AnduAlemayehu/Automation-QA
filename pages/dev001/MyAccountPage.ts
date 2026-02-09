import { Page, Locator, expect } from '@playwright/test';

interface ProfileData {
  email: string;
  country: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export class MyAccountPage {
  private page: Page;

  private profileMenuButton: Locator;
  private myAccountMenuItem: Locator;
  private editButton: Locator;
  private emailInput: Locator;
  private countryDropdown: Locator;
  private saveButton: Locator;
  private successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profileMenuButton = page.getByRole('button').filter({ hasText: /^$/ });
    this.myAccountMenuItem = page.getByRole('menuitem', { name: 'My Account' });
    this.editButton = page.getByRole('button', { name: 'Edit' });

    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.countryDropdown = page.getByRole('combobox', { name: 'Country' });
    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.successToast = page.getByText(
      /Account Information Updated Successfully!/i
    );
  }

  async openMyAccount() {
    await this.profileMenuButton.click();
    await this.myAccountMenuItem.click();
  }

  async editProfile(data: ProfileData) {
    await this.editButton.click();

    // Email
    await this.emailInput.fill(data.email);

    // Country
    await this.countryDropdown.click();
    await this.page.getByRole('option', {
      name: data.country,
      exact: true,
    }).click();

    // Date of birth
    const dobInput = this.page.getByRole('textbox', {
      name: 'Select date of birth',
    });
    await dobInput.fill(data.dateOfBirth);
    await dobInput.press('Enter');

    // Phone number
    const phoneInput = this.page
      .locator('div.mat-mdc-text-field-wrapper')
      .filter({ hasText: 'Phone Number' })
      .locator('input');

    await phoneInput.fill(data.phoneNumber);
  }

  async saveChanges() {
    await this.saveButton.click();
  }

  async verifyProfileSaved() {
    await expect(this.successToast).toBeVisible();
  }
}
