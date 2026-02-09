import { test } from '@playwright/test';
import { DemoAccountLoginPage } from '../../pages/dev001//DemoAccountLoginPage';
import { CoreSportsLeftPanelPage } from '../../pages/dev001/CoreSportsLeftPanelPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
test.describe('Core Sports Display - Left Panel', () => {

  test('User should see 6 core sports after login', async ({ page }) => {
 
    

    const loginPage = new DemoAccountLoginPage(page);
    const coreSportsLeftPanelPage = new CoreSportsLeftPanelPage(page);
    
        await loginPage.navigate(ENV.desktopBaseUrl);
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
