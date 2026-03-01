import { Page, expect } from '@playwright/test';

export class BetslipSettingsPage {
  constructor(private page: Page) {}

  async openSettings() {
    
    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await this.page.getByRole('menuitem', { name: 'Betslip Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Betslip Settings' })).toBeVisible();
    console.log('✅ Betslip Settings page opened');
  }

  async selectRadio(option: string) {
    
    await this.page.getByRole('radio', { name: option }).check();
    await expect(this.page.getByRole('radio', { name: option })).toBeChecked();
    console.log(`✅ Radio setting applied: ${option}`);
  }

  async editStake(oldStake: string, newStake: string) {
    console.log(`\n🔄 Updating Default Stake: ${oldStake} → ${newStake}`);

    await this.page.getByRole('button', { name: oldStake }).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();

    await expect(this.page.getByRole('button', { name: 'Set' })).toBeVisible();

    const stakeInput = this.page.locator('input').last();
    await stakeInput.fill(newStake);

    await this.page.getByRole('button', { name: 'Set' }).click();
    await this.page.getByRole('button', { name: newStake }).click();

  }

  async saveSettings(action: string) {
   
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText(/Bet Slip Settings Updated/i)).toBeVisible();
    console.log(`✅ Settings saved successfully (${action})`);
  }

  async verifyRadioSelected(option: string) {
    await expect(this.page.getByRole('radio', { name: option })).toBeChecked();
    console.log(`✔ Verified persisted radio: ${option}`);
  }

  async verifyStakeVisible(stake: string) {
    await expect(this.page.getByRole('button', { name: stake })).toBeVisible();
    console.log(`✔ Verified persisted stake: ${stake}`);
  }
}