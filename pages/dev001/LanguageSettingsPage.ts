import { Page, expect } from '@playwright/test';

export class LanguageSettingsPage {

  constructor(private page: Page) {}

  // =============================
  // 🔹 Open Language Settings (English UI)
  // =============================
  async openLanguageSettings() {
    console.log('\n🔄 Opening language settings (English UI)...');

    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await this.page.getByRole('menuitem', { name: 'Select Language' }).click();
  }

  // =============================
  // 🔹 Open Language Settings (Spanish UI)
  // =============================
  async openLanguageSettingsSpanish() {
    console.log('\n🔄 Opening language settings (Spanish UI)...');

    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await this.page.getByRole('menuitem', { name: 'Seleccionar Idioma' }).click();
  }

  // =============================
  // 🔹 Change Language (English → Spanish)
  // =============================
  async changeLanguage(currentLabel: string, newLanguage: string, action: string) {

    console.log(`\n🌐 ${action}`);

    await this.page.getByRole('combobox', { name: currentLabel })
      .locator('svg')
      .click();
      

    await this.page.getByText(newLanguage).click();
    await this.page.getByRole('button', { name: 'Change' }).click();

    console.log(`✅ Language switched to ${newLanguage}`);
  }

  // =============================
  // 🔹 Change Language (Spanish → English)
  // =============================
  async changeLanguageFromSpanish(
    currentOption: string,
    newOption: string,
    action: string
  ) {

    console.log(`\n🌐 ${action}`);

    await this.page.locator('#mat-select-value-0').click();
    await this.page.getByRole('option', { name: newOption }).click();
    await this.page.getByRole('button', { name: 'Cambiar' }).click();

    // Wait until Spanish disappears
    await expect.poll(async () => {
      return await this.page.locator('text=Inicio').count();
    }, { timeout: 60000 }).toBe(0);

    console.log('✅ Language reverted to English');
  }

  // =============================
  // 🔹 Verify Spanish UI
  // =============================
  async verifySpanishUI(data: any) {

    console.log('\n🔎 Verifying Spanish UI...');

    await expect(this.page.getByRole('link', { name: data.home }))
      .toBeVisible({ timeout: 60000 });

    await expect(this.page.getByRole('link', { name: data.inPlay, exact: true }))
      .toBeVisible();

    await expect(this.page.locator('app-header')
      .getByRole('link', { name: data.sport }))
      .toBeVisible();

    await expect(this.page.getByText(data.exposure))
      .toBeVisible();

    console.log('✔ Spanish UI verified');
  }

  // =============================
  // 🔹 Verify Persistence
  // =============================
  async verifySpanishPersistence() {

    console.log('\n🔁 Verifying persistence...');

    await expect(this.page.getByRole('link', { name: 'Inicio' }))
      .toBeVisible({ timeout: 60000 });

    console.log('✔ Spanish persisted after refresh');
  }

  // =============================
  // 🔹 Verify English UI
  // =============================
  async verifyEnglishUI(data: any) {

    console.log('\n🔎 Verifying English UI restored...');

    await expect(this.page.getByRole('link', { name: data.home })).toBeVisible({ timeout: 60000 });
    await expect(this.page.getByRole('link', { name: data.myMarkets })).toBeVisible();
    await expect(this.page.getByText(data.exposure )).toBeVisible();

    await expect(this.page.getByText('Inicio')).toHaveCount(0);
    await expect(this.page.getByText('Exposición:')).toHaveCount(0);

    console.log('✔ English UI fully restored');
  }

}