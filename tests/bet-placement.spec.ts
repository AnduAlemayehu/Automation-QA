import { test, expect } from './base/loggedInBase';
import { InPlayPage } from '../pages/InPlayPage';
import { BetSlipPage } from '../pages/BetSlipPage';
import betStakeData from '../data/betStakeData.json';

test.describe('Bet Placement – Exposure Update', () => {
  for (const data of betStakeData) {
    test(`${data.testName}`, async ({ page, homePage }) => {
      const inPlayPage = new InPlayPage(page);
      const betSlip = new BetSlipPage(page);

      // ============ BEFORE SCREENSHOT ============
      await page.screenshot({
        path: `screenshots/${data.testName}-before-bet.png`,
        fullPage: true
      });

      // 💡 Capture BEFORE values
      const balanceBefore = await homePage.getBalance();
      const exposureBefore = await homePage.getExposure();
      const availableToBetBefore = await homePage.getAvailableToBet();

      console.log(`💰 Balance BEFORE: ${balanceBefore}`);
      console.log(`📉 Exposure BEFORE: ${exposureBefore}`);
      console.log(`✅ Available to bet BEFORE: ${availableToBetBefore}`);

      if (balanceBefore <= Number(data.stake)) {
        console.warn('❌ Insufficient balance, skipping test');
        // Take screenshot of insufficient balance state
        await page.screenshot({
          path: `screenshots/${data.testName}-insufficient-balance.png`,
          fullPage: true
        });
        test.skip();
      }

      // Navigate and open match
      await inPlayPage.openInPlay();
      await inPlayPage.openFirstMatchOrExit(); 

      // Open bet slip safely
      const betSlipOpened = await betSlip.openBetSlip();
      if (!betSlipOpened) {
        console.log('⏭️ Skipping test: no valid back odds to place bet');
        await page.screenshot({
          path: `screenshots/${data.testName}-no-odds-available.png`,
          fullPage: true
        });
        test.skip();
      }

      // Place bet and measure duration
      const startTime = Date.now();
      await betSlip.placeBet(data.stake);
      const duration = Date.now() - startTime;

      const result = await betSlip.waitForToast();
      console.log(`⏱ Bet placement duration: ${duration} ms`);

      // ============ AFTER SCREENSHOT ============
      await page.screenshot({
        path: `screenshots/${data.testName}-after-bet.png`,
        fullPage: true
      });

      // 💡 Capture AFTER values
      const balanceAfter = await homePage.getBalance();
      const exposureAfter = await homePage.getExposure();
      const availableToBetAfter = await homePage.getAvailableToBet();

      console.log(`💰 Balance AFTER: ${balanceAfter}`);
      console.log(`📉 Exposure AFTER: ${exposureAfter}`);
      console.log(`✅ Available to bet AFTER: ${availableToBetAfter}`);

      // Handle toast result
      if (result === 'ERROR') {
        console.warn('❌ Bet rejected by system');
        console.log('⚠️ No change in balance, exposure, or available-to-bet');
        
        // Screenshot of error toast
        await page.screenshot({
          path: `screenshots/${data.testName}-bet-rejected.png`,
          fullPage: true
        });
        return;
      }

      // Compare before and after
      const balanceChanged = balanceBefore !== balanceAfter;
      const exposureChanged = exposureBefore !== exposureAfter;
      const availableChanged = availableToBetBefore !== availableToBetAfter;

      if (balanceChanged || exposureChanged || availableChanged) {
        console.log('✅ Bet placed successfully: values updated after placing bet');
      } else {
        console.warn('❌ Bet placement did not update values');
        // Screenshot for failed update
        await page.screenshot({
          path: `screenshots/${data.testName}-no-update.png`,
          fullPage: true
        });
      }

      // Optional: assert exposure updated
      await expect.poll(
        async () => await homePage.getExposure(),
        { timeout: 30000 }
      ).not.toBe(exposureBefore);
    });
  }
});