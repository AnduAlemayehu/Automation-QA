import { test, expect } from '@playwright/test';
import { MobileDemoAccountLoginPage } from '../../pages/dev001-mobile/MobileDemoAccountLoginPage';
import { MobileInPlayPage } from '../../pages/dev001-mobile/MobileInPlayPage';
import { MobileBetSlipPage }  from '../../pages/dev001-mobile/MobileInBetSlipPage';
import { ENV } from '../../config/env.config';
import loginData from '../../data/loginData.json';

test.describe('Mobile - Early Bet Placement + Description Validation', () => {

  test('User places bet and verifies description in My Bets', async ({ page }) => {

    const loginPage = new MobileDemoAccountLoginPage(page);
    const inplayPage = new MobileInPlayPage(page);
    const betslipPage = new MobileBetSlipPage(page);

    // 🔐 Login
    await loginPage.navigate(ENV.mobileBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.verifyLoginSuccess();

    // 🎯 Capture odd before placing
    const selectedOdd = await inplayPage.getOddValue();

    // 🎯 Place bet
    await inplayPage.clickOdd();

    const stake = '100';

    await inplayPage.placeBet(stake);
    await inplayPage.waitForSuccess();

    // 📂 Open My Bets
    await betslipPage.openMyBets();
    await betslipPage.verifyRowVisible();

    const betData = await betslipPage.getLatestBetData();

    // ✅ Validations
    
    expect(betData.betId).toMatch(/^\d+$/);
    expect(betData.description).toContain('v');
    expect(betData.type).toBe('BACK');
    expect(Number(betData.odds)).toBeGreaterThan(1);
    expect(Number(betData.stake)).toBeGreaterThan(0);
    expect(betData.status).toBe('MATCHED');

    console.log('🎯 Verified Bet:', betData);
  });

});
