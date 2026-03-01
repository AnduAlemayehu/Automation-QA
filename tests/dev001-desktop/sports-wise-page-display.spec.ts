import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { SportsTabPage } from '../../pages/dev001/SportsTabPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Sports wise page display (Tab Switching) - DEV Desktop', () => {

  test('Switching between sports wise should load correct data within 2 seconds', async ({ page }) => {

    const loginPage = new DemoAccountLoginPage(page);
    const sportsPage = new SportsTabPage(page);

    sportsPage.captureConsoleErrors();

    // 🔹 Login

  await loginPage.navigate(ENV.desktopBaseUrl);
  await loginPage.login(loginData.username, loginData.password);
  await loginPage.verifyLoginSuccess();


    // 🔹 Validate sport switching
    
    await sportsPage.verifySportSwitch('Soccer');
    await sportsPage.verifySportSwitch('Tennis');
    await sportsPage.verifySportSwitch('Cricket');
   

    await sportsPage.verifyNoConsoleErrors();
  });

});