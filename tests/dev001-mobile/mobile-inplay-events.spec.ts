import { test } from '@playwright/test';
import { MobileDemoAccountLoginPage } from './../../pages/dev001-mobile/MobileDemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';
import { MobileInPlayEventsPage } from '../../pages/dev001-mobile/MobileInPlayEventsPage';

test.describe('Inplay Events Page', () => {

  test('User should see inplay events after login', async ({ page }) => {
    const loginPage =  new MobileDemoAccountLoginPage(page);
    const inplayPage = new MobileInPlayEventsPage(page);
    
      
        await loginPage.navigate(ENV.mobileBaseUrl);
        await loginPage.login(loginData.username, loginData.password);
        await loginPage.verifyLoginSuccess();

    const loadTime = await inplayPage.openAndMeasureLoadTime();

    // Optional: soft expectation (NON-blocking insight)
    test.info().annotations.push({
      type: 'InplayLoadTime',
      description: `${loadTime} seconds`,
    });
  });

});
