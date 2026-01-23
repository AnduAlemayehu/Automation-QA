import { test, expect } from "./base/loggedInBase";
import { InPlayBetSyncPage } from "../pages/InPlayBetSyncPage";
import { InPlayPage } from "../pages/InPlayPage";
import { BetSlipPage } from "../pages/BetSlipPage";
import { MyBetsPage } from "../pages/MyBetsPage";
import betStakeData from "../data/betStakeData.json";

for (const data of betStakeData) {
  test(data.testName, async ({ page, homePage }, testInfo) => {
    const inPlay = new InPlayBetSyncPage(page);
    const inPlayPage = new InPlayPage(page);
    const betSlipPage = new BetSlipPage(page);
    const myBetsPage = new MyBetsPage(page);

    const MAX_MATCH_TRIES = 2;
    const MAX_STAKE_TRIES = 1;
    const STAKE_INCREMENT = 20;

    let matchIndex = 0;
    let betPlaced = false;

    // 📸 helper for screenshots
    const captureFailure = async (reason: string) => {
      if (page.isClosed()) {
        console.log(
          `⚠️ Cannot capture screenshot, page already closed (${reason})`
        );
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${data.testName}-${reason}-${timestamp}.png`;

      try {
        await page.screenshot({
          path: `screenshots/${fileName}`,
          fullPage: true,
        });

        await testInfo.attach(fileName, {
          path: `screenshots/${fileName}`,
          contentType: "image/png",
        });

        console.log(`📸 Screenshot captured: ${fileName}`);
      } catch (e) {
        console.log(`⚠️ Screenshot failed: ${e}`);
      }
    };

    try {
      await inPlay.openInPlay();

      while (matchIndex < MAX_MATCH_TRIES) {
        console.log(`\n=== TRY MATCH INDEX ${matchIndex} ===`);

        if (!(await inPlay.openMatchByIndex(matchIndex))) {
          matchIndex++;
          continue;
        }

        if (await inPlay.isMarketSuspendedOrClosed()) {
          await captureFailure(`market-invalid-${matchIndex}`);
          await inPlay.returnToInPlay();
          matchIndex++;
          continue;
        }

        const side = await inPlay.openBetSlipPreferBack();
        if (!side) {
          await captureFailure(`odds-invalid-${matchIndex}`);
          await inPlay.returnToInPlay();
          matchIndex++;
          continue;
        }

        console.log(`🎯 Betting side selected: ${side}`);

        // 🔹 capture BEFORE wallet values
        const balanceBefore = await inPlay.getBalance();
        const exposureBefore = await inPlay.getExposure();

        let stake = Number(data.stake);

        // 🔁 STAKE RETRY LOOP
        for (let attempt = 1; attempt <= MAX_STAKE_TRIES; attempt++) {
          console.log(`💰 Stake attempt ${attempt}: ${stake}`);

          const result = await inPlay.placeBetOnce(String(stake));
          // Wait 3 seconds before placing the bet
          await new Promise((resolve) => setTimeout(resolve, 3000));

          const enabled = await inPlay.isPlaceBetEnabled();
          console.log(`🟢 result and button: ${enabled} and ${result}`);
          if (!enabled) {
            console.log("🔴 Place Bet disabled → increasing stake");
            stake += STAKE_INCREMENT;
            continue;
          }
          if (result === "ERROR") {
            console.log("🔴 Place Bet response error → increasing stake");
            stake += STAKE_INCREMENT;
            continue;
          }
 
          if (result === "SUCCESS") {
            const balanceAfter = await inPlay.getBalance();
            const exposureAfter = await inPlay.getExposure();

            console.log(`💰 Balance after: ${balanceAfter.toFixed(2)}`);
            console.log(`📊 Exposure after: ${exposureAfter.toFixed(2)}`);

            

            betPlaced = true;
            break;
          }

          console.log(`❌ Bet failed (${result}) → increasing stake`);
          await captureFailure(`bet-failed-stake-${stake}`);
          stake += STAKE_INCREMENT;
        }

        if (betPlaced) break;

        console.log("🔁 Moving to next match");
        await inPlay.returnToInPlay();
        matchIndex++;
      }

      //sync slip bet with my bets

            // await inPlayPage.openInPlay();
           console.log("starting the slip  sync");
            await inPlayPage.clickOddToOpenBetSlip();

            // Bet Slip
            await betSlipPage.waitForOpen();
            const betSlipValues = await betSlipPage.getBetSlipValues();

            console.log("BET SLIP:", betSlipValues);

            // My Bets
            await myBetsPage.openMyBets();
            const myBetsValues = await myBetsPage.getMyBetsValues(
              betSlipValues.betSlipId
            );

            console.log("MY BETS:", myBetsValues);

            // Assertions
            expect(myBetsValues.myBetsId).toContain(betSlipValues.betSlipId);
            expect(myBetsValues.myBetsSelectionName).toContain(
              betSlipValues.selectionName
            );
            expect(myBetsValues.myBetsOdds).toBe(betSlipValues.oddsValue);
            expect(myBetsValues.myBetsStake).toContain(
              betSlipValues.stakeValue
            );

      if (!betPlaced) {
        await captureFailure("no-bet-placed");
        console.log("Bet could not be placed after all retries");
        // throw new Error('Bet could not be placed after all retries');
      }
    } catch (error) {
      console.log("🔥 Unexpected error:", "after all try");
      await captureFailure("unexpected-error");
      throw error;
    }
  });
}
