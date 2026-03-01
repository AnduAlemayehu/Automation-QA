import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { LanguageSettingsPage } from '../../pages/dev001/LanguageSettingsPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import languageData from '../../data/languageData.json';

test.describe('Language Selection on DEV Desktop', () => {

  test('Change language to Spanish, verify, persist and revert', async ({ page }) => {

    const loginPage = new DemoAccountLoginPage(page);
    const languagePage = new LanguageSettingsPage(page);

    console.log('\n==============================');
    console.log('🌍 LANGUAGE TEST STARTED');
    console.log('==============================');

    // 🔐 Login
    await loginPage.navigate(ENV.desktopBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.verifyLoginSuccess();

    // 🌐 Change to Spanish
    await languagePage.openLanguageSettings();
    await languagePage.changeLanguage(
      languageData.english.label,
      languageData.spanish.label,
      'CHANGE_TO_SPANISH'
    );

    // ✅ Verify Spanish UI
    await languagePage.verifySpanishUI(languageData.spanish);

    // 🔁 Verify persistence
    await languagePage.verifySpanishPersistence();

    // 🔄 Revert to English
    await languagePage.openLanguageSettingsSpanish();
    await languagePage.changeLanguageFromSpanish(
      languageData.english.option,
      languageData.spanish.option,
      'REVERT_TO_ENGLISH'
    );

    // ✅ Verify English restored
    await languagePage.verifyEnglishUI(languageData.english);

    console.log('\n==============================');
    console.log('✅ LANGUAGE TEST COMPLETED');
    console.log('==============================\n');

  });

});