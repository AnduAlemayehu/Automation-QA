import { test } from '@playwright/test';
import { InPlayEventsPage } from '../../pages/dev001/InPlayEventsPage';
import { LoadMarketPage } from './../../pages/dev001/LoadMarketPage';
import { DemoAccountLoginPage } from '../../pages/dev001/DemoAccountLoginPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';


test.describe('Market Page Loading', () => {

  test('Market page should load and display markets', async ({ page }) => {
    const loginPage = new DemoAccountLoginPage(page);
    const inplayPage = new InPlayEventsPage(page);
    const marketPage = new LoadMarketPage(page);
    
        await loginPage.navigate(ENV.desktopBaseUrl);
        await loginPage.login(loginData.username, loginData.password);
        await loginPage.verifyLoginSuccess();
   

    const InplayloadTime = await inplayPage.openAndMeasureLoadTime();

    // Optional: soft expectation (NON-blocking insight)
    test.info().annotations.push({
      type: 'InplayLoadTime',
      description: `${InplayloadTime} seconds`,
    });
  

    const MarketloadTime = await marketPage.openAndMeasureMarketLoadTime();

    // Non-blocking informational annotation
    test.info().annotations.push({
      type: 'MarketLoadTime',
      description: `${MarketloadTime} seconds`,
    });
  });


});
