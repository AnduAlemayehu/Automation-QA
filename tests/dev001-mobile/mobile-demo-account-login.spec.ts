import { test } from '@playwright/test';
// import { MobileDemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import { HomePage } from '../../pages/HomePage';
import { MobileDemoAccountLoginPage } from './../../pages/dev001-mobile/MobileDemoAccountLoginPage';

test.describe('Demo Account Login - DEV Smoke', () => {

  test('@demo Mobile: Demo user login with valid credentials', async ({ page }) => {
    const loginPage = new MobileDemoAccountLoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.navigate(ENV.mobileBaseUrl);
    await loginPage.login(loginData.username, loginData.password);

    const startTime = Date.now();
    await loginPage.verifyLoginSuccess();
   
    const endTime = Date.now();
    await loginPage.verifyPageLoad();

    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱ Login page loaded in ${loadTimeSeconds} seconds`);
  });

});
