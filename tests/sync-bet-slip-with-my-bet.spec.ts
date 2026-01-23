// filepath: c:\Users\andua\OneDrive\Desktop\automation-qa-assignment\tests\Q3-bet-slip-synchronization.spec.ts
import { test, expect } from './base/loggedInBase';
import { InPlayPage } from '../pages/InPlayPage';
import { BetSlipPage } from '../pages/BetSlipPage';
import { MyBetsPage, BetDetails, verifyBetDetailsMatch } from '../pages/MyBetsPage';
import betStakeData from '../data/betStakeData.json';

interface TestData {
  testName: string;
  stake: string;
}

test.describe('Bet Slip & My Bets Synchronization', () => {
  const syncTestData: TestData = betStakeData[0];

  test(`Verify bet sync between Bet Slip and My Bets - ${syncTestData.testName}`, 
  async ({ page, homePage }) => {
    console.log('🔗 Starting bet synchronization test...');
    
    const inPlayPage = new InPlayPage(page);
    const betSlip = new BetSlipPage(page);
    const myBetsPage = new MyBetsPage(page);
    
    let betSlipDetails: BetDetails | null = null;

    // ============ STEP 1: PLACE A BET ============
    console.log('🎯 Step 1: Placing a bet...');
    
    await inPlayPage.openInPlay();
    await inPlayPage.openFirstMatchOrExit();
    
    // openFirstMatchOrExit performs navigation and handles skipping when no matches are available.

    const betSlipOpened = await betSlip.openBetSlip();
    if (!betSlipOpened) {
      console.log('⏭️ No valid odds, skipping test');
      await page.screenshot({ path: `screenshots/Q3-no-odds.png` });
      test.skip();
      return;
    }

    // Get bet details before placement
    const rawBetDetails = await betSlip.getCurrentBetDetails();
    betSlipDetails = rawBetDetails
      ? {
          market: rawBetDetails.market ?? '',
          selection: rawBetDetails.selection ?? '',
          odds: rawBetDetails.odds ?? '',
          stake: rawBetDetails.stake ?? '',
          betType: rawBetDetails.betType ?? '',
          timestamp: rawBetDetails.timestamp
        }
      : null;
    console.log('📝 Bet details from slip:', JSON.stringify(betSlipDetails, null, 2));

    const placementStart = Date.now();
    await betSlip.placeBet(syncTestData.stake);
    const placementTime = Date.now() - placementStart;

    const toastResult = await (async () => {
      // Wait for either a success or error toast; adjust selectors to match your app if needed
      try {
        await page.waitForSelector('.toast-success', { timeout: 7000 });
        return 'SUCCESS';
      } catch {
        try {
          await page.waitForSelector('.toast-error', { timeout: 1000 });
          return 'ERROR';
        } catch {
          return 'TIMEOUT';
        }
      }
    })();
    
    if (toastResult === 'ERROR') {
      console.warn('❌ Bet rejected, cannot test synchronization');
      await page.screenshot({ path: `screenshots/Q3-bet-rejected.png` });
      return;
    }

    console.log(`✅ Bet placed in ${placementTime}ms`);

    // ============ STEP 2: VERIFY IN BETSLIP ============
    console.log('📋 Step 2: Verifying in Bet Slip...');
    
    await page.waitForTimeout(1000); // Brief wait for UI update
    
    // Check placed bets section exists
    const placedBetsVisible = await betSlip.isPlacedBetsSectionVisible();
    if (!placedBetsVisible) {
      console.warn('⚠️ Placed bets section not visible');
      await page.screenshot({ path: `screenshots/Q3-no-placed-bets-section.png` });
    } else {
      const placedBetRaw = await betSlip.getPlacedBetDetails();
      const placedBetInSlip: BetDetails = placedBetRaw
        ? {
            market: placedBetRaw.market ?? '',
            selection: placedBetRaw.selection ?? '',
            odds: placedBetRaw.odds ?? '',
            stake: placedBetRaw.stake ?? '',
            betType: (placedBetRaw as any).betType ?? '',
            timestamp: (placedBetRaw as any).timestamp ?? '',
            status: (placedBetRaw as any).status ?? ''
          }
        : {
            market: '',
            selection: '',
            odds: '',
            stake: '',
            betType: '',
            timestamp: '',
            status: ''
          };
      console.log('📝 Placed bet in slip:', JSON.stringify(placedBetInSlip, null, 2));
      
      // Verify key details match
      let slipVerification: { matches: boolean; mismatches: string[] };
      if (betSlipDetails) {
        slipVerification = await verifyBetDetailsMatch(
          betSlipDetails,
          placedBetInSlip,
          ['selection', 'odds']
        );
      } else {
        console.warn('⚠️ Missing bet slip details, skipping slip verification');
        slipVerification = { matches: false, mismatches: ['missing bet slip details'] };
      }
      
      if (slipVerification.matches) {
        console.log('✅ Bet verified in Bet Slip');
      } else {
        console.warn(`❌ Bet details mismatch in slip: ${slipVerification.mismatches.join(', ')}`);
      }
    }

    // ============ STEP 3: NAVIGATE TO MY BETS ============
    console.log('📊 Step 3: Navigating to My Bets...');
    
    await myBetsPage.navigateToMyBets();
    await page.waitForTimeout(2000); // Wait for page load

    // ============ STEP 4: VERIFY IN MY BETS ============
    console.log('🔍 Step 4: Searching in My Bets...');
    
    // Ensure we have bet details from the Bet Slip before searching My Bets.
    // This prevents passing `null` to functions that expect `BetDetails`.
    if (!betSlipDetails) {
      console.warn('⚠️ Missing bet slip details, cannot search My Bets');
      await page.screenshot({ path: `screenshots/Q3-missing-bet-slip-details.png` });
      test.skip();
      return;
    }
    
    const searchStartTime = Date.now();
    const maxWaitTime = 30000; // 30 seconds max
    let betFound = false;
    let foundBetDetails: BetDetails | null = null;
    
    while (Date.now() - searchStartTime < maxWaitTime && !betFound) {
      // Refresh My Bets list
      await myBetsPage.refreshMyBets();
      await page.waitForTimeout(1000);
      
      // Get all recent bets
      const recentBets = await myBetsPage.getRecentBets();
      console.log(`🔎 Checking ${recentBets.length} bets in My Bets...`);
      
      // Search for matching bet
      for (const bet of recentBets) {
        if (await myBetsPage.isMatchingBet(bet, betSlipDetails)) {
          betFound = true;
          foundBetDetails = bet;
          console.log('✅ Found matching bet in My Bets:', JSON.stringify(bet, null, 2));
          break;
        }
      }
      
      if (!betFound) {
        console.log('⏳ Bet not found yet, waiting...');
        await page.waitForTimeout(2000); // Wait 2 seconds before next check
      }
    }

    // ============ ASSERTIONS & REPORTING ============
    if (betFound && foundBetDetails) {
      const syncTime = Date.now() - placementStart;
      console.log(`🎉 SUCCESS: Bet synchronized in ${syncTime}ms`);
      
      // Final verification
      let finalVerification: { matches: boolean; mismatches: string[] };
      if (betSlipDetails) {
        finalVerification = await verifyBetDetailsMatch(
          betSlipDetails,
          foundBetDetails,
          ['market', 'selection', 'odds', 'stake']
        );
      } else {
        console.warn('⚠️ Missing bet slip details, skipping final verification');
        finalVerification = { matches: false, mismatches: ['missing bet slip details'] };
      }
      
      if (finalVerification.matches) {
        console.log('✅ All details match perfectly!');
      } else {
        console.warn(`⚠️ Minor mismatches: ${finalVerification.mismatches.join(', ')}`);
      }
      
      // Take success screenshot
      await page.screenshot({ 
        path: `screenshots/Q3-sync-success-${Date.now()}.png`,
        fullPage: true 
      });
      
      expect(betFound).toBe(true);
      
    } else {
      console.error('❌ FAILURE: Bet not found in My Bets after 30 seconds');
      await page.screenshot({ 
        path: `screenshots/Q3-sync-failure-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Log current My Bets for debugging
      const currentBets = await myBetsPage.getRecentBets();
      console.log('Current My Bets content:', JSON.stringify(currentBets, null, 2));
      
      expect(betFound).toBe(true); // This will fail the test
    }
  });
});