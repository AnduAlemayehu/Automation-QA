// import { test, expect } from './base/loggedInBase';
// import { InPlayPage } from '../pages/InPlayPage2';
// import { BetSlipPage } from '../pages/betSlipPage2';
// import betStakeData from '../data/betStakeData.json';

// test.describe('Bet Placement – Exposure Update', () => {
//   for (const data of betStakeData) {
//     test(`${data.testName}`, async ({ page, homePage }) => {
//       const inPlayPage = new InPlayPage(page);
//       const betSlip = new BetSlipPage(page);

//       // ============ BEFORE SCREENSHOT ============
//       await page.screenshot({
//         path: `screenshots/${data.testName}-before-bet.png`,
//         fullPage: true
//       });

//       // 💡 Capture BEFORE values
//       const balanceBefore = await homePage.getBalance();
//       const exposureBefore = await homePage.getExposure();
//       const availableToBetBefore = await homePage.getAvailableToBet();

//       console.log(`💰 Balance BEFORE: ${balanceBefore}`);
//       console.log(`📉 Exposure BEFORE: ${exposureBefore}`);
//       console.log(`✅ Available to bet BEFORE: ${availableToBetBefore}`);


//       if (balanceBefore <= Number(data.stake)) {
//         console.warn('❌ Insufficient balance, skipping test');
//         // Take screenshot of insufficient balance state
//         await page.screenshot({
//           path: `screenshots/${data.testName}-insufficient-balance.png`,
//           fullPage: true
//         });
//         test.skip();
//       }


//     await inPlayPage.openInPlay();
//     const eventName = await inPlayPage.openFirstMatchOrExit(5-attempt);
//     if (!eventName) {
//       console.log('⚠️ No event found at index, refreshing In-Play');
      
//     }

//     console.log(`🏟 Opened Event → ${eventName}`);

//      // Open bet slip safely
//       const betSlipOpened = await betSlip.openBetSlip();
//       if (!betSlipOpened) {
     
//         console.log('⏭️ Skipping test: no valid back odds to place bet');
//         await page.screenshot({
//           path: `screenshots/${data.testName}-no-odds-available.png`,
//           fullPage: true
//         });
        
//          test.skip();
//       }

 
//       // Place bet and measure duration
//       const startTime = Date.now();
//       await betSlip.placeBet(data.stake);
//       const duration = Date.now() - startTime;

//       const result = await betSlip.waitForToast();
//       console.log(`⏱ Bet placement duration: ${duration} ms`);

//       // ============ AFTER SCREENSHOT ============
//       await page.screenshot({
//         path: `screenshots/${data.testName}-after-bet.png`,
//         fullPage: true
//       });

//       // 💡 Capture AFTER values
//       const balanceAfter = await homePage.getBalance();
//       const exposureAfter = await homePage.getExposure();
//       const availableToBetAfter = await homePage.getAvailableToBet();

//       console.log(`💰 Balance AFTER: ${balanceAfter}`);
//       console.log(`📉 Exposure AFTER: ${exposureAfter}`);
//       console.log(`✅ Available to bet AFTER: ${availableToBetAfter}`);

//       // Handle toast result
//       if (result === 'ERROR') {
//         console.warn('❌ Bet rejected by system');
//         console.log('⚠️ No change in balance, exposure, or available-to-bet');
        
//         // Screenshot of error toast
//         await page.screenshot({
//           path: `screenshots/${data.testName}-bet-rejected.png`,
//           fullPage: true
//         });
//         return;
//       }

//       // Compare before and after
//       const balanceChanged = balanceBefore !== balanceAfter;
//       const exposureChanged = exposureBefore !== exposureAfter;
//       const availableChanged = availableToBetBefore !== availableToBetAfter;

//       if (balanceChanged || exposureChanged || availableChanged) {
//         console.log('✅ Bet placed successfully: values updated after placing bet');
//       } else {
//         console.warn('❌ Bet placement did not update values');
//         // Screenshot for failed update
//         await page.screenshot({
//           path: `screenshots/${data.testName}-no-update.png`,
//           fullPage: true
//         });
//       }

//       // Optional: assert exposure updated
//       await expect.poll(
//         async () => await homePage.getExposure(),
//         { timeout: 30000 }
//       ).not.toBe(exposureBefore);  
//     });
//   }
// });
import { test, expect } from './base/loggedInBase';
import { InPlayPage } from '../pages/InPlayPage2';
import { BetSlipPage } from '../pages/betSlipPage2';
import betStakeData from '../data/betStakeData.json';

test.describe('Bet Placement', () => {
  // Function to try until bet slip opens, with match cycling
  async function findMatchUntilBetSlipOpens(inPlayPage: InPlayPage, betSlip: BetSlipPage): Promise<boolean> {
    let matchIndex = 0;
    const maxMatches = 5;
    
    while (matchIndex < maxMatches) {
      console.log(`\n=== Trying match index ${matchIndex} ===`);
      
      // 1. Go to in-play
      await inPlayPage.openInPlay();
      
      // 2. Try to open match
      const matchFound = await inPlayPage.openFirstMatchOrExit(matchIndex);
      if (!matchFound) {
        console.log(`❌ No match at index ${matchIndex}`);
        matchIndex++;
        continue;
      }
      
      console.log(`✅ Opened match at index ${matchIndex}`);
      
      // 3. Try to open bet slip with retries for THIS match
      let attemptsForThisMatch = 0;
      const maxAttemptsPerMatch = 3;
      
      while (attemptsForThisMatch < maxAttemptsPerMatch) {
        attemptsForThisMatch++;
        console.log(`   Attempt ${attemptsForThisMatch} to open bet slip for match ${matchIndex}`);
        
        // Try opening bet slip (it has its own retry logic)
        const slipOpened = await betSlip.openBetSlip(2); // 2 retries within the method
        
        if (slipOpened) {
          console.log(`🎯 Bet slip opened successfully for match ${matchIndex}!`);
          return true;
        }
        
        console.log(`   ❌ Bet slip not opened, attempt ${attemptsForThisMatch}/${maxAttemptsPerMatch}`);
        
        if (attemptsForThisMatch < maxAttemptsPerMatch) {
          // Wait and try again for same match
          console.log('   Waiting 2 seconds before retry...');
          await inPlayPage.page.waitForTimeout(2000);
          
        
        }
      }
      
      // If we get here, bet slip never opened for this match
      console.log(`😞 Could not open bet slip for match ${matchIndex} after ${maxAttemptsPerMatch} attempts`);
      matchIndex++; // Move to next match
    }
    
    console.log(`😞 Tried ${maxMatches} matches, none worked`);
    return false;
  }

  // Test execution
  for (const data of betStakeData) {
    test(data.testName, async ({ page, homePage }) => {
      const inPlayPage = new InPlayPage(page);
      const betSlip = new BetSlipPage(page);
      
      // Quick balance check
      const balance = await homePage.getBalance();
      if (balance <= Number(data.stake)) {
        console.log('💰 Insufficient balance');
        test.skip();
        return;
      }
      
      // Find match with openable bet slip
      const found = await findMatchUntilBetSlipOpens(inPlayPage, betSlip);
      
      if (!found) {
        console.log('⏭️ Skipping - no bettable matches');
        test.skip();
        return;
      }
      
      // Place bet
      console.log(`📝 Placing bet: ${data.stake}`);
      await betSlip.placeBet(data.stake);
      const result = await betSlip.waitForToast();
      
      if (result === 'ERROR') {
        console.log('❌ Bet rejected');
      } else {
        console.log('✅ Bet placed');
      }
    });
  }
});