import { test, expect } from './base/loggedInBase';
import { InPlayPage } from '../pages/InPlayPage';
import { BetSlipPage } from '../pages/BetSlipPage';
import betStakeData from '../data/betStakeData.json';

test.describe('Bet Placement – Exposure Update', () => {
  for (const data of betStakeData) {
    test(`${data.testName}`, async ({ page, homePage }) => {
      const inPlayPage = new InPlayPage(page);
      const betSlip = new BetSlipPage(page);

      const exposureBefore = await homePage.getExposure();
      expect(exposureBefore).not.toBe('');

      await inPlayPage.openInPlay();
      await inPlayPage.selectFirstMatchOdds();

      await betSlip.placeBet(data.stake);

      await expect.poll(
        async () => await homePage.getExposure(),
        { timeout: 30000 }
      ).not.toBe(exposureBefore);
    });
  }
});
