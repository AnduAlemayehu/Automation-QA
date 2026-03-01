import { test, expect, chromium } from "@playwright/test";
import { ENV } from "../../config/env.config";
import users from "../../data/loginData.json";
import { BaseLogin } from "../../pages/BaseLogin";
import { DesktopInPlayPage } from "../../pages/DesktopInPlayPage";
import { MobileInPlayPage } from "../../pages/MobileInPlayPage";
import { isValidOdds } from "../../utils/odds.utils";
import betStakeData from '../../data/betStakeData.json';


test.describe("@dev @bit @description", () => {
  test("Display Runner name, Odds, Stake size, Market name, Internal Bet id", async () => {
    // ─────────────────────────────────────────────
    // Launch TWO browsers (true parallelism)
    // ─────────────────────────────────────────────
    const desktopBrowser = await chromium.launch({
      headless: false,
      args: ["--window-size=1100,720", "--window-position=0,0"],
    });

    
    const desktopCtx = await desktopBrowser.newContext({ viewport: null });
    
    const desktopPage = await desktopCtx.newPage();
    
    const data = betStakeData[0];
    let stake = Number(data.stake);
    // ─────────────────────────────────────────────
    // Navigate in PARALLEL
    // ─────────────────────────────────────────────
    await Promise.all([
      desktopPage.goto(ENV.desktopBaseUrl, { waitUntil: "domcontentloaded" }),
    ]);

    // ─────────────────────────────────────────────
    // Login in PARALLEL
    // ─────────────────────────────────────────────
    const desktopLogin = new BaseLogin(desktopPage, "desktop");
    

    await Promise.all([
      desktopLogin.login(users.username, users.password),
      
    ]);

    // ─────────────────────────────────────────────
    // Open In-Play event in PARALLEL
    // ─────────────────────────────────────────────
    const desktop = new DesktopInPlayPage(desktopPage);
   

    await Promise.all([desktop.openInPlayEvent()]);

    // const desktopLowLiquidityMarket = await desktop.getLowliquidityMarket();

    // console.log("Desktop low liquidity market:", desktopLowLiquidityMarket);


    // ─────────────────────────────────────────────
    // Capture odds in PARALLEL (ms-level)
    // ─────────────────────────────────────────────
    const desktopOdds1 = desktop.getOddsData();
    
    console.log("=======  Before Place Bet =======")

    console.log("value odds :", (await desktopOdds1).value);
    console.log(" time :", (await desktopOdds1).time);

    await desktop.clickOdds();

    const result = await desktop.placeBetOnce(String(stake));

    if (result === "ERROR") {
      console.log("🔴 Place Bet response error ");
     
    }

    if (result === "SUCCESS") {

     

      const desktopOdds2 = desktop.getOddsData();
      //   mobile.getOddsWithTimestamp(),
      console.log("======= After Place Bet =======")
      console.log("value odds  :", (await desktopOdds2).value);
      console.log(" time :", (await desktopOdds2).time);

      await desktop.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 10000));
      const betSlipValues = await desktop.getBetSlipValues();

      console.log("Placed BET SLIP:", betSlipValues);
    }

      await desktop.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 10000));
      const betSlipValues = await desktop.getBetSlipValues();

      console.log("Placed BET SLIP:", betSlipValues);
    // ─────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────
    await Promise.all([desktopBrowser.close()]);
  });
});
