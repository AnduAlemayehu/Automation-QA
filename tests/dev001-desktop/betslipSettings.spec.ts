import { test } from '@playwright/test';
import { BetslipSettingsPage } from '../../pages/dev001/BetslipSettingsPage';
import testData from '../../data/betslipSettingsData.json';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Betslip Settings - Data Driven POM', () => {

  test('Modify, persist and revert betslip settings', async ({ page }) => {

    const loginPage = new DemoAccountLoginPage(page);
    const betslipPage = new BetslipSettingsPage(page);


        // 🔹 Login
    
      await loginPage.navigate(ENV.desktopBaseUrl);
      await loginPage.login(loginData.username, loginData.password);
      await loginPage.verifyLoginSuccess();

  console.log('\n==============================');
  console.log('🚀 TEST STARTED');
  console.log('==============================');



  await betslipPage.openSettings();

  // 🔹 Modify
  await betslipPage.selectRadio(testData.modifySettings.flashMode);
  await betslipPage.selectRadio(testData.modifySettings.persistence);
  await betslipPage.selectRadio(testData.modifySettings.appearance);

  await betslipPage.editStake(
    testData.revertSettings.originalStake,
    testData.modifySettings.newStake
  );

  await betslipPage.saveSettings('MODIFICATION');

  console.log('\n🔁 Refreshing to verify persistence...');
  
   await page.getByRole('link', { name: 'Home' }).click();

  await betslipPage.openSettings();

  await betslipPage.verifyRadioSelected(testData.modifySettings.flashMode);
  await betslipPage.verifyRadioSelected(testData.modifySettings.persistence);
  await betslipPage.verifyRadioSelected(testData.modifySettings.appearance);
  await betslipPage.verifyStakeVisible(testData.modifySettings.newStake);

  console.log('\n🔄 Reverting settings back to original values...');

  // 🔹 Revert
  await betslipPage.selectRadio(testData.revertSettings.flashMode);
  await betslipPage.selectRadio(testData.revertSettings.persistence);
  await betslipPage.selectRadio(testData.revertSettings.appearance);

  await betslipPage.editStake(
    testData.modifySettings.newStake,
    testData.revertSettings.originalStake
  );

  await betslipPage.saveSettings('REVERT');

  console.log('\n==============================');
  console.log('✅ TEST COMPLETED SUCCESSFULLY');
  console.log('==============================\n');
  });

});