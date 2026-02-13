import { test } from "@playwright/test";
import { MobileDemoAccountLoginPage } from "../../pages/dev001-mobile/MobileDemoAccountLoginPage";
import { ENV } from "../../config/env.config";
import loginData from "../../data/loginData.json";
import { MobileLoadMarketPage } from "../../pages/dev001-mobile/MobileLoadMarketPage";
test.describe("Market loading Page", () => {
  test("User should see market loaded events click", async ({ page }) => {
    const loginPage = new MobileDemoAccountLoginPage(page);
    const loadMarketPage = new MobileLoadMarketPage(page);

    await loginPage.navigate(ENV.mobileBaseUrl);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.verifyLoginSuccess();

    const inplaySpeed = await loadMarketPage.openAndMeasureLoadTime();
    const marketSpeed = await loadMarketPage.measureMarketLoadTime();
   

    console.log("--- Performance Report ---");
    console.log("InPlay Speed:", inplaySpeed.loadTime);
    console.log("Market Speed:", marketSpeed);
    
    // Optional: soft expectation (NON-blocking insight)
    test.info().annotations.push({
      type: "MarketLoadTime",
      description: `${marketSpeed} seconds`,
    });
  });
});
