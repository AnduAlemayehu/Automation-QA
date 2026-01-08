import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import loginData from '../data/loginData.json';

test('Login and measure Time to Interactive (TTI) @performance', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();

  const startTime = Date.now();
  await loginPage.login(loginData.username, loginData.password);

  await homePage.waitForDashboard();
  const tti = Date.now() - startTime;

  console.log(`Time to Interactive: ${tti} ms`);

  await expect(homePage.dashboardMenu).toBeVisible();
});
