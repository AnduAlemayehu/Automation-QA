import { test, expect, chromium } from "@playwright/test";
import { ENV } from "../../config/env.config";
import users from "../../data/loginData.json";
import { BaseLogin } from "../../pages/BaseLogin";
import { DesktopInPlayPage } from "../../pages/DesktopInPlayPage";
import { MobileInPlayPage } from "../../pages/MobileInPlayPage";
import { isValidOdds } from "../../utils/odds.utils";
import betStakeData from '../../data/betStakeData.json';


test.describe("@dev @OddsSync @Observational", () => {
  test("Desktop vs Mobile odds synchronization (parallel)", async () => {
    // ─────────────────────────────────────────────
    // Launch TWO browsers (true parallelism)
    // ─────────────────────────────────────────────
    const desktopBrowser = await chromium.launch({
      headless: false,
      args: ["--window-size=1100,720", "--window-position=0,0"],
    });

    const mobileBrowser = await chromium.launch({
      headless: false,
      args: ["--window-size=390,844", "--window-position=1100,0"],
    });

    const desktopCtx = await desktopBrowser.newContext({ viewport: null });
    const mobileCtx = await mobileBrowser.newContext({
      viewport: { width: 390, height: 720 },
      isMobile: true,
      hasTouch: true,
    });

    const desktopPage = await desktopCtx.newPage();
    const mobilePage = await mobileCtx.newPage();
    const data = betStakeData[0];
    let stake = Number(data.stake);
    // ─────────────────────────────────────────────
    // Navigate in PARALLEL
    // ─────────────────────────────────────────────
    await Promise.all([
      desktopPage.goto(ENV.desktopBaseUrl, { waitUntil: "domcontentloaded" }),
      mobilePage.goto(ENV.mobileBaseUrl, { waitUntil: "domcontentloaded" }),
    ]);

    // ─────────────────────────────────────────────
    // Login in PARALLEL
    // ─────────────────────────────────────────────
    const desktopLogin = new BaseLogin(desktopPage, "desktop");
    const mobileLogin = new BaseLogin(mobilePage, "mobile");

    await Promise.all([
      desktopLogin.login(users.username, users.password),
      mobileLogin.login(users.username, users.password),
    ]);

    // ─────────────────────────────────────────────
    // Open In-Play event in PARALLEL
    // ─────────────────────────────────────────────
    const desktop = new DesktopInPlayPage(desktopPage);
    const mobile = new MobileInPlayPage(mobilePage);

    await Promise.all([desktop.openInPlayEvent(), mobile.openInPlayEvent()]);

    const desktopLowLiquidityMarket = await desktop.getLowliquidityMarket();

    console.log("Desktop low liquidity market:", desktopLowLiquidityMarket);

    await mobile.findLowLiquidityMarket(desktopLowLiquidityMarket!);

    // ─────────────────────────────────────────────
    // Capture odds in PARALLEL (ms-level)
    // ─────────────────────────────────────────────
    const desktopOdds1 = desktop.getOddsData();
    
    console.log("======= OnDesktop Before Place Bet =======")

    console.log("onDesktop app odds :", (await desktopOdds1).value);
    console.log("onDesktop app time :", (await desktopOdds1).time);

    await desktop.clickOdds();

    const result = await desktop.placeBetOnce(String(stake));

    if (result === "ERROR") {
      console.log("🔴 Place Bet response error ");
     
    }

    if (result === "SUCCESS") {

     

      const desktopOdds2 = desktop.getOddsData();
      //   mobile.getOddsWithTimestamp(),
      console.log("======= After Place Bet =======")
      console.log("onDesktop app odds  :", (await desktopOdds2).value);
      console.log("onDesktop app time :", (await desktopOdds2).time);

      await desktop.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 10000));
      const betSlipValues = await desktop.getBetSlipValues();

      console.log("Placed BET SLIP:", betSlipValues);
    }


    // ─────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────
    await Promise.all([desktopBrowser.close(), mobileBrowser.close()]);
  });
});
