import { Page, Locator, expect } from '@playwright/test';

type BetSide = 'BACK' | 'LAY';

export class InPlayBettingPage {
  readonly page: Page;

  readonly inPlayTab: Locator;
  readonly matchLinks: Locator;
  readonly marketHeader: Locator;

  readonly backOdds: Locator;
  readonly layOdds: Locator;

  readonly stakeInput: Locator;
  readonly placeBetBtn: Locator;

  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly betSlipDrawer: Locator;

  readonly balance: Locator;
  readonly exposure: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.inPlayTab = page.getByText('In-Play', { exact: true })
    // this.inPlayTab=page.getByRole('link', { name: 'In-Play' })
    this.inPlayTab=page.getByRole('link', { name: 'In-Play', exact: true })
    // this.inPlayTab=page.getByRole('link', { name: 'In-Play' }).first()
 
    this.matchLinks = page.locator('tr td:first-child a');
    this.rows = page.locator('tr');
   


    this.marketHeader = page.getByLabel(/match odds/i).locator('div').first();

    // ⚠️ Adjust nth() if UI changes
    this.backOdds = page.locator('tr.market-runner-row td').nth(3);
    this.layOdds  = page.locator('tr.market-runner-row td').nth(4);

    this.stakeInput = page.getByRole('textbox', { name: /stake/i });
    this.placeBetBtn = page.getByRole('button', { name: /place bet/i });

    this.successToast = page.locator('text=/success|submitted|placed/i');
    this.errorToast = page.locator('text=/error|failed|rejected|suspended/i');

    this.betSlipDrawer = page.locator(
      'mat-drawer.bet-slip-wrapper.mat-drawer-opened'
    );

    this.balance = page
      .locator('span.balance-value.text-balance.balance-val')
      .first();

    this.exposure = page
      .locator(
        "//span[contains(@class,'exposure-val')]"
      )
      .first();
  }

  /* ====================== WALLET ====================== */

  async getBalance(): Promise<number> {
    const text = await this.balance.innerText();
    const value = Number(text.replace(/[^\d.]/g, ''));
    console.log(`💰 Balance: ${value}`);
    return value;
  }

  async getExposure(): Promise<number> {
    const text = await this.exposure.innerText();
    const value = Number(text.replace(/[^\d.-]/g, ''));
    console.log(`📊 Exposure: ${value}`);
    return value;
  }

  /* ====================== NAVIGATION ====================== */

  async openInPlay() {
    console.log('➡️ Opening In-Play');
    await this.inPlayTab.click();
    await expect(this.matchLinks.first()).toBeVisible({ timeout: 20000 });
    console.log('✅ In-Play loaded');
  }

 async openMatchByIndex(index: number): Promise<boolean> {
  console.log(`🔍 Attempting to open match at index ${index}`);

  // Always re-evaluate count (DOM changes fast in-play)
  const count = await this.matchLinks.count();
  console.log(`📋 Current match count: ${count}`);

  if (count === 0 || index >= count) {
    console.log(`❌ Match index ${index} no longer available`);
    return false;
  }

  // const match = this.matchLinks.nth(index);
   const match = this.rows
    .nth(index)
    .locator('td')
    .nth(0)
    .locator('b');

  try {
    // Wait shortly for stability
    await match.waitFor({ state: 'visible', timeout: 3000 });

    // innerText with SHORT timeout to avoid 60s hang
    const name = (await match.innerText({ timeout: 2000 })).trim();
    console.log(`🏟 Opening match [${index}] → ${name}`);

    await match.click({ timeout: 3000 });
    console.log('✅ Match clicked');
    await this.page.waitForTimeout(800);
    console.log('✅ Match clicked waiting finished');
    return true;
  } catch (error) {
    console.log(
      `⚠️ Match at index ${index} became unavailable (DOM refresh)`
    );
    return false;
  }
}

  async returnToInPlay() {
    console.log('🔙 Returning to In-Play');
    await this.inPlayTab.click();
    await this.page.waitForTimeout(800);
  }

  /* ====================== MARKET CHECK ====================== */

  private async isOddsValid(locator: Locator, label: string): Promise<boolean> {
    const text = (await locator.innerText().catch(() => '')).trim();
    console.log(`🎯 ${label} odds value: "${text}"`);

    if (
      text === '' ||
      text === '-' ||
      text === '0' ||
      text === 'SUSP'
    ) {
      console.log(`⛔ Invalid ${label} odds`);
      return false;
    }

    return true;
  }

  async isMarketSuspendedOrClosed(): Promise<boolean> {
    const marketText = await this.marketHeader.innerText().catch(() => '');

    if (/suspended/i.test(marketText)) {
      console.log('⛔ Market SUSPENDED');
      return true;
    }

    if (/closed/i.test(marketText)) {
      console.log('⛔ Market CLOSED');
      return true;
    }

    return false;
  }

  /* ====================== BET SLIP (BACK → LAY) ====================== */

  async openBetSlipPreferBack(): Promise<BetSide | null> {
    console.log('🎯 Attempting BACK odds first');

    if (await this.isOddsValid(this.backOdds, 'BACK')) {
      await this.backOdds.click();
      await this.page.waitForTimeout(500);

      if (await this.betSlipDrawer.isVisible()) {
        console.log('✅ Bet slip opened with BACK odds');
        return 'BACK';
      }
    }

    console.log('🔄 BACK empty→ checking LAY odds');

    if (await this.isOddsValid(this.layOdds, 'LAY')) {
      await this.layOdds.click();
      await this.page.waitForTimeout(500);

      if (await this.betSlipDrawer.isVisible()) {
        console.log('✅ Bet slip opened with LAY odds');
        return 'LAY';
      }
    }

    console.log('❌ Neither BACK nor LAY odds available');
    return null;
  }

  async isPlaceBetEnabled(): Promise<boolean> {
    const enabled = await this.placeBetBtn.isEnabled().catch(() => false);
    console.log(
      enabled
        ? '🟢 Place Bet button ENABLED'
        : '🔴 Place Bet button DISABLED'
    );
    return enabled;
  }

  async placeBetOnce(stake: string): Promise<'SUCCESS' | 'ERROR' | 'NONE'> {
    console.log(`📝 Entering stake: ${stake}`);
    await this.stakeInput.fill(stake);

    const clickStart = Date.now();
    console.log('🖱 Clicking Place Bet');

    try {
      await this.placeBetBtn.click({ timeout: 30000 });
    } catch {
      console.log('❌ Place Bet click failed');
      return 'ERROR';
    }

    try {
      await Promise.race([
        this.successToast.first().waitFor({ timeout: 8000 }),
        this.errorToast.first().waitFor({ timeout: 8000 }),
      ]);

      const durationMs = Date.now() - clickStart;
      console.log(`⏱ Bet response time: ${durationMs} ms`);

      if (await this.successToast.first().isVisible()) {
        console.log('✅ Bet SUCCESS');
        return 'SUCCESS';
      }

      if (await this.errorToast.first().isVisible()) {
        console.log('❌ Bet ERROR');
        return 'ERROR';
      }

      console.log('⚠️ No toast detected');
      return 'NONE';
    } catch {
      console.log('⚠️ Bet response timeout');
      return 'NONE';
    }
  }
}
