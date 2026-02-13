import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001//DemoAccountLoginPage';
import { ChangePasswordPage } from '../../pages/dev001/ChangePasswordPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Change Password', () => {

  test('User should change password successfully', async ({ page }) => {
    
    const loginPage = new DemoAccountLoginPage(page);
    const changePasswordPage = new ChangePasswordPage(page);
    
        await loginPage.navigate(ENV.desktopBaseUrl);
        await loginPage.login(loginData.username, loginData.password);
        await loginPage.verifyLoginSuccess();

   

 

    // Change password
    await changePasswordPage.openChangePassword();
    await changePasswordPage.changePassword(
      loginData.password,
      loginData.newPassword
    );
    await changePasswordPage.verifyPasswordChanged();

    // 🔁 IMPORTANT: revert password back

    await loginPage.login(loginData.username, loginData.newPassword);
    await loginPage.verifyLoginSuccess();
    await changePasswordPage.openChangePassword();
    await changePasswordPage.changePassword(
      loginData.newPassword,
      loginData.password
    );
    await changePasswordPage.verifyPasswordChanged();
  });

});
