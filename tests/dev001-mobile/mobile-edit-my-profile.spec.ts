import { test } from '@playwright/test';
import { MobileDemoAccountLoginPage } from './../../pages/dev001-mobile/MobileDemoAccountLoginPage';
import { MobileMyProfilePage } from './../../pages/dev001-mobile/MobileMyProfilePage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import profileData from '../../data/mobileProfileData.json';

test.describe('My Profile Page', () => {

  test('User should edit and save profile changes successfully', async ({ page }) => {

    const loginPage = new MobileDemoAccountLoginPage(page);
    const myProfilePage = new MobileMyProfilePage(page);

    // Login
    await loginPage.navigate(ENV.mobileBaseUrl);
    await loginPage.login(loginData.username, loginData.password);

    // Open My Profile
    await myProfilePage.open();

    // Update profile using external data
    await myProfilePage.updateProfile(profileData.validProfileUpdate as any);

    await myProfilePage.verifyProfileSaved(
      profileData.validProfileUpdate.phone
    );

  });

});