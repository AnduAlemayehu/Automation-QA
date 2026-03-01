import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { AccountStatementPage } from '../../pages/dev001/AccountStatementPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Account Statement - Desktop DEV', () => {

  test('Verify complete and accurate transaction details', async ({ page }) => {

    const loginPage = new DemoAccountLoginPage(page);
    const accountPage = new AccountStatementPage(page);

    // 🔐 Login
    await loginPage.navigate(ENV.desktopBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.verifyLoginSuccess();

console.log('\n==============================');
console.log('📊 ACCOUNT STATEMENT TEST STARTED');
console.log('==============================');

    // 📄 Navigate
    await accountPage.navigateToAccountStatement();
    await accountPage.filterByLast15Days();
    await accountPage.verifyPageLoaded();

    // ✅ Validations
    await accountPage.verifyColumnsDisplayed();
    await accountPage.verifyTransactionsExist();
    await accountPage.verifyFirstRowStructure();
    await accountPage.verifyNoDuplicateBetIds();
    await accountPage.verifyBalanceFlow();

console.log('\n==============================');
console.log('🎉 ALL ACCOUNT STATEMENT VALIDATIONS PASSED');
console.log('==============================\n');

  });

});