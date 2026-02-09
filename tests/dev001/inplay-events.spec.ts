import { test } from '@playwright/test';
import { InPlayEventsPage } from '../../pages/dev001/InPlayEventsPage';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Inplay Events Page', () => {

  test('User should see inplay events after login', async ({ page }) => {
    const loginPage = new DemoAccountLoginPage(page);
    const inplayPage = new InPlayEventsPage(page);
    
        await loginPage.navigate(ENV.desktopBaseUrl);
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
