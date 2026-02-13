import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import { HomePage } from '../../pages/HomePage';

test.describe('Demo Account Login - DEV Smoke', () => {

  test('@demo Desktop: Demo user login with valid credentials', async ({ page }) => {
    const loginPage = new DemoAccountLoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.navigate(ENV.desktopBaseUrl);
    await loginPage.login(loginData.username, loginData.password);

    const startTime = Date.now();
    await loginPage.verifyLoginSuccess();
    await homePage.waitForPageReady();
    const endTime = Date.now();

    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱ Login page loaded in ${loadTimeSeconds} seconds`);
  });

});
