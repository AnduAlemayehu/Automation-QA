import { Page, expect } from '@playwright/test';

export class BetSlipPage {
  private betSlip;

  constructor(private page: Page) {
    this.betSlip = page.locator(
      '.mat-drawer.bet-slip-wrapper.mat-drawer-end.mat-drawer-opened.mat-drawer-side'
    );
  }

  async waitForOpen() {
    await expect(this.betSlip).toBeVisible({ timeout: 10000 });
  }

  async getBetSlipValues() {
    // Bet ID
    const betSlipIdText = await this.betSlip.locator('b:visible').innerText();
    const betSlipId = betSlipIdText.replace('ID:', '').trim();

    // Selection name
    // const selectionName = await this.betSlip
    //   .locator('a.event-anchor.font-bold')
    //   .innerText();
    const selectionName = await this.betSlip
  .locator('a.event-anchor.font-bold')
  .first()
  .innerText();

    // Odds
    const oddsValue = await this.betSlip
      .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title span')
      .nth(1)
      .innerText();

    // Stake
    const stakeValue = await this.betSlip
      .locator('mat-panel-title.mat-expansion-panel-header-title.panel-title span')
      .nth(2)
      .innerText();

    return {
      betSlipId,
      selectionName,
      oddsValue,
      stakeValue,
    };
  }
}
