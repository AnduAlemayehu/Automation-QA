
import { test, expect } from '@playwright/test';

test('Bet Slip values should match My Bets values', async ({ page }) => {

  // ===============================
  // LOGIN
  // ===============================
  await page.goto('https://sit-desktop.freedemokit.com/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('john');
  await page.getByRole('textbox', { name: 'Password' }).fill('john');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // ===============================
  // OPEN IN-PLAY & MARKET
  // ===============================
  await page.getByRole('link', { name: 'In-Play', exact: true }).click();
  

  // ===============================
  // CLICK ODD TO OPEN BET SLIP
  // ===============================
  await page
    .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title')
    .locator('span')
    .nth(1)
    .click();

//   ===============================
//   BET SLIP DRAWER (Angular-safe)
//   ===============================
  const betSlip = page.locator(".mat-drawer.bet-slip-wrapper.mat-drawer-end.mat-drawer-opened.mat-drawer-side")

//   await betSlip.waitFor({ state: 'attached', timeout: 10000 });

//   ===============================
//   READ VALUES FROM BET SLIP
//   ===============================

  // Bet ID
  
  const betSlipIdText = await betSlip.locator('b:visible').innerText();
  const betSlipId = betSlipIdText.replace('ID:', '').trim();


//   const selectionName = await betSlip.locator('a.event-anchor.font-bold').innerText();
  const selectionName = await betSlip
  .locator('a.event-anchor.font-bold')
  .first()
  .innerText();
  // Odds value
  const oddsValue = await betSlip
    .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title span')
    .nth(1)
    .innerText();
    

  // Stake value
  const stakeValue = await betSlip
    .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title span')
    .nth(2)
    .innerText();

  console.log('BET SLIP VALUES:', {
    betSlipId,
    selectionName,
    oddsValue,
    stakeValue,
  });

  // ===============================
  // OPEN MY BETS
  // ===============================
  await page.locator('button.mat-mdc-menu-trigger.user-btn').click();
  await page.getByText('My Bets', { exact: true }).click();

  // Select "Current Bets"
  await page
    .locator("//mat-select[@id='mat-select-1']//div[@class='mat-mdc-select-arrow']//*[name()='svg']")
    .click();

  await page.locator('mat-option:has-text("Current Bets")').click();

  // ===============================
  // FIND CORRECT MY BETS ROW (by ID)
  // ===============================
  const myBetsRow = page.locator(`tr.bet-item:has-text("")`).first();
  await expect(myBetsRow).toBeVisible({ timeout: 10000 });

  // ===============================
  // READ VALUES FROM MY BETS
  // ===============================
  const myBetsId = await myBetsRow.locator('td').nth(0).innerText();
  const myBetsSelectionName = await myBetsRow.locator('td').nth(2).locator('a').innerText();
  const myBetsOdds = await myBetsRow.locator('td').nth(5).innerText();
  const myBetsStake = await myBetsRow.locator('td').nth(7).innerText();

  console.log('MY BETS VALUES:', {
    myBetsId,
    myBetsSelectionName,
    myBetsOdds,
    myBetsStake,
  });

  // ===============================
  // ASSERTIONS
  // ===============================
  expect(myBetsId).toContain(betSlipId);
  expect(myBetsSelectionName).toContain(selectionName);
  expect(myBetsOdds).toBe(oddsValue);
  expect(myBetsStake).toContain(stakeValue);
});
