import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { MyAccountPage } from '../../pages/dev001/MyAccountPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import profileData from '../../data/profileData.json';

test.describe('My Account - Edit Profile', () => {
  test('User should edit and save profile changes successfully', async ({ page }) => {
    const loginPage = new DemoAccountLoginPage(page);
    const myAccountPage = new MyAccountPage(page);

    await loginPage.navigate(ENV.desktopBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.verifyLoginSuccess();

    await myAccountPage.openMyAccount();
    await myAccountPage.editProfile(profileData);
    await myAccountPage.saveChanges();
    await myAccountPage.verifyProfileSaved();
  });
});
