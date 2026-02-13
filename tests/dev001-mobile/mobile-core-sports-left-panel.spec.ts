import { test } from '@playwright/test';
import { MobileDemoAccountLoginPage } from './../../pages/dev001-mobile/MobileDemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import { MobileCoreSportsMenuPage } from './../../pages/dev001-mobile/MobileCoreSportsLeftPanelPage';
test.describe('Mobile Core Sports Display - Left drawable', () => {

  test('User should see 6 core sports after login', async ({ page }) => {
 
    

    const loginPage = new MobileDemoAccountLoginPage(page);
    const coreSportsLeftPanelPage = new MobileCoreSportsMenuPage(page);
    
        await loginPage.navigate(ENV.mobileBaseUrl);
        await loginPage.login(loginData.username, loginData.password);
        await loginPage.verifyLoginSuccess();


    const coreSports = [
      'Cricket',
      'Soccer',
      'Tennis',
      'Horse Racing',
      'Greyhound Racing',
      'Basketball',
    ];

    await coreSportsLeftPanelPage.verifyCoreSportsDisplayed(coreSports);
  });

});
