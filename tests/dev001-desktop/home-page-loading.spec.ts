import { test, expect } from "@playwright/test";
import { HomeNavigationPage } from "../../pages/dev001/HomeNavigationPage";
import { ENV } from "../../config/env.config";
import { DemoAccountLoginPage } from "./../../pages/dev001/DemoAccountLoginPage";
import loginData from "../../data/loginData.json";

test("Desktop Main navigation speed  and loading", async ({ page }) => {
  const loginPage = new DemoAccountLoginPage(page);
  const homeNav = new HomeNavigationPage(page);

  // Capture console errors
  homeNav.captureConsoleErrors();

  // 🔹 Login

  await loginPage.navigate(ENV.desktopBaseUrl);
  await loginPage.login(loginData.username, loginData.password);
  await loginPage.verifyLoginSuccess();

  // 🔹 Main menu navigation
  await homeNav.testMainMenus();

  // 🔹 Header sports navigation
  await homeNav.testHeaderSports();

  // 🔹 Highlight tab navigation
  await homeNav.testHighlightTabs();

  // 🔎 Console validation
  await homeNav.verifyNoConsoleErrors();
});
