import { Page, Locator, expect } from '@playwright/test';

type ProfileData = {
  dateLabel: string;
  phone: string;
  country: string;
  twoFactor?: 'enable' | 'disable';
};

export class MobileMyProfilePage {
  private page: Page;

  private menuButton: Locator;
  private myProfileMenuItem: Locator;

  private calendarIcon: Locator;
  private phoneInput: Locator;
  private countryDropdown: Locator;

  private saveButton: Locator;
  private successToast: Locator;
  private editButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.getByRole('button', { name: 'menu' });
    this.myProfileMenuItem = page.getByText('My Profile');
   
    this.editButton = page.locator('ion-header [slot="end"]');
   
    this.calendarIcon = this.page.locator(
    'ion-button[size="small"][fill="outline"][color="medium"]'
  );
    // this.calendarButton = page.locator('ion-button:has(svg.ionicon)');
    this.phoneInput = page.getByPlaceholder('Phone Number');
    this.countryDropdown = page.locator('#select-label');

    this.saveButton = page.getByRole('button', { name: 'SAVE' });

    this.successToast = page.getByText(/profile updated|success|saved/i);
  }

 
async open() {
  await this.menuButton.click();
  await this.myProfileMenuItem.click();

  // wait until profile content loads
//   await expect(this.phoneInput).toBeVisible({ timeout: 10000 });

  await expect(this.editButton).toBeVisible();
  await this.editButton.click();

  // verify edit mode enabled
  await expect(this.phoneInput).toBeEditable();
}
  async updateProfile(data: ProfileData) {

    // Update Date of Birth
    await this.calendarIcon.click();
    await this.page.getByRole('button', { name: data.dateLabel }).click();
    await this.page.getByRole('button', { name: 'Done' }).click();

    // Update Phone
    await this.phoneInput.fill(data.phone);

    // Update Country
    await this.countryDropdown.click();
    await this.page.getByRole('radio', { name: data.country }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();

    // Two Factor
    if (data.twoFactor === 'enable') {
      await this.page.getByRole('radio', { name: 'Enable' }).click();
    } else if (data.twoFactor === 'disable') {
      await this.page.getByRole('radio', { name: 'Disable' }).click();
    }

    await this.saveButton.click();
  }


  async verifyProfileSaved(updatedPhone: string) {
  await expect(this.phoneInput).toHaveValue(updatedPhone);
//   await expect(this.phoneInput).toBeDisabled(); // confirms save mode ended

await expect(this.saveButton).not.toBeVisible();
}
}