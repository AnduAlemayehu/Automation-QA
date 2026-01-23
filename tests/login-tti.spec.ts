import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import loginData from '../data/loginData.json';

test('Login and measure Time to Interactive (TTI) @performance', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();

  await loginPage.fillCredentials(
    loginData.username,
    loginData.password
  );

  // ⏱️ Start TTI exactly at submit
  const startTime = performance.now();
  await loginPage.submit();

  await homePage.waitForPageReady();

  const tti = Math.round(performance.now() - startTime);

  // 📊 Attach to test report
  testInfo.annotations.push({
    type: 'TTI',
    description: `${tti} ms`,
  });

  console.log(`⏱️ Time to Interactive: ${tti} ms`);

  await expect(homePage.dashboardMenu).toBeEnabled();
});
