import { test } from '@playwright/test';
import { MobileDemoAccountLoginPage } from './../../pages/dev001-mobile/MobileDemoAccountLoginPage';
import { MobileChangePasswordPage } from './../../pages/dev001-mobile/MobileChangePasswordPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Change Password Page', () => {

  test('User should successfully change password on mobile app', async ({ page }) => {

    const loginPage = new MobileDemoAccountLoginPage(page);
    const changePasswordPage = new MobileChangePasswordPage(page);

    // Login
    await loginPage.navigate(ENV.mobileBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    // await loginPage.verifyLoginSuccess();

    // Open Change Password
    await changePasswordPage.open();

    // Change Password
    

    await changePasswordPage.changePassword(
      loginData.password,
      loginData.newPassword
    );

    // await changePasswordPage.verifyPasswordChanged();

    // Optional: revert password back (VERY IMPORTANT for test stability)
    await loginPage.login(loginData.username, loginData.newPassword);
    await changePasswordPage.open();
    await changePasswordPage.changePassword(
      loginData.newPassword,
      loginData.password
    );
    // await changePasswordPage.verifyPasswordChanged();
  });

});
