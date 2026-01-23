import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import loginData from '../../data/loginData.json';

export const test = base.extend<{
  homePage: HomePage;
}>({
  homePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.fillCredentials(
    loginData.username,
    loginData.password
  );
     await loginPage.submit();
     await homePage.waitForPageReady();

    await use(homePage);
  }
});

export { expect } from '@playwright/test';
