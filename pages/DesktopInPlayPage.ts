import { Page, Locator,expect } from '@playwright/test';

export class DesktopInPlayPage {
  private odds: Locator;
  readonly matchLinks: Locator;
  readonly stakeInput: Locator;
  readonly placeBetBtn: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  private betSlip: Locator;

  constructor(private page: Page) {
    this.odds = page.locator('tr.market-runner-row td').nth(3);
    this.matchLinks = page.locator('tr td:first-child a');
    // this.backOdds = page.locator('tr.market-runner-row td').nth(3);

    this.stakeInput = page.getByRole('textbox', { name: /stake/i });
    this.placeBetBtn = page.getByRole('button', { name: /place bet/i });

    this.successToast = page.locator('text=/success|submitted|placed/i');
    this.errorToast = page.locator('text=/error|failed|rejected|suspended/i');
    // this.betSlip = page.locator(
    //   '.mat-drawer.bet-slip-wrapper.mat-drawer-end.mat-drawer-opened.mat-drawer-side'
    // );
    this.betSlip = page.locator('mat-drawer.mat-drawer.bet-slip-wrapper.mat-drawer-end.mat-drawer-push.mat-drawer-opened');
  }

  async openInPlayEvent() {
    // await this.page.goto('/in-play');
    
    await this.page.getByRole('link', { name: 'In-Play', exact: true }).click();
    // console.log('desktop In-Play link clicked');

    const count = await this.matchLinks.count();
    // console.log(`📋 Current match count: ${count}`);

    await this.page.getByRole('button').nth(5).click();

    console.log("Sort descending button clicked");

    await this.page.locator('tr td:first-child a').first().click();
    console.log('desktop event clicked')

    const cell = this.page.locator('tr.market-runner-row').locator('td').nth(0)

const name = (await cell.innerText())
  .replace('equalizer', '')
  .trim();

console.log(name); 
  }

 async getLowliquidityMarket(): Promise<string | null> {
  const cell = this.page
    .locator('tr.market-runner-row')
    .locator('td')
    .nth(0);

  const name = (await cell.innerText())
    .replace('equalizer', '')
    .trim()
    .split('\n')[0]  // ⬅ keep only the name
    .trim();

  return name;
}

  async getOdds(): Promise<string | null> {
    return (await this.odds.first().innerText())?.trim() || null;
    // const text = (await locator.innerText().catch(() => '')).trim();
  }

async getOddsData() {
  const odds = (await this.odds.first().innerText())?.trim() || null;

  const now = new Date();
  const time = `${now.toTimeString().split(' ')[0]}:${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`;

  return { value: odds, time };
}

//to clik on odd value
async clickOdds(){
    await this.odds.first().click();
      await this.page.waitForTimeout(500);
}

async placeBetOnce(stake: string): Promise<'SUCCESS' | 'ERROR' | 'NONE'> {
    console.log(`📝 Entering stake: ${stake}`);
    await this.stakeInput.fill(stake);

    const clickStart = Date.now();
    // console.log('🖱 Clicking Place Bet');

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
 



   async waitForOpen() {
      await expect(this.betSlip).toBeVisible({ timeout: 30000 });
    }
  async getBetSlipValues() {
  // 1️⃣ Get FIRST expanded bet panel
  const betPanel = this.page
    .locator('mat-expansion-panel.mat-expansion-panel.panel-row.bg-back-i.mat-expansion-panel-animations-enabled.mat-expanded.mat-expansion-panel-spacing')

  // 2️⃣ Event name
  const eventName = await this.betSlip
    .locator('div.event-td-header')
    .first()
    .innerText();

  // 3️⃣ Runner
  const marketRunner = await this.betSlip
    .locator(
      'mat-panel-title.mat-expansion-panel-header-title.panel-title span'
    )
    .nth(0)
    .innerText();

  // 4️⃣ Market name (🔥 dynamic, no hard-coding)
 
  const marketName = await this.page  
   .locator("body > app-root:nth-child(1) > app-pages:nth-child(3) > div:nth-child(1) > div:nth-child(2) > app-main:nth-child(2) > mat-drawer-container:nth-child(2) > mat-drawer:nth-child(6) > div:nth-child(1) > app-open-bets:nth-child(2) > div:nth-child(1) > mat-accordion:nth-child(2) > mat-expansion-panel:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > app-matched-bets:nth-child(1) > mat-accordion:nth-child(1) > table:nth-child(1) > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > a:nth-child(1)").first()
.innerText();
  // 5️⃣ Odds
  const oddsValue = await this.betSlip
    .locator(
      'mat-panel-title.mat-expansion-panel-header-title.panel-title span'
    )
    .nth(1)
    .innerText();

  // 6️⃣ Stake
  const stakeValue = await this.betSlip
    .locator(
      'mat-panel-title.mat-expansion-panel-header-title.panel-title span'
    )
    .nth(2)
    .innerText();

  // 7️⃣ Bet ID (🔥 dynamic, no hard-coding)

  // const betId = await this.page
  //   .locator('div.bet-details')
  //   .locator('b')
  //   .allInnerTexts();


  return {
    eventName,
    marketRunner,
    marketName,
    oddsValue,
    stakeValue,
    // betId
  };
}



  async getOddsWithTimestamp() {
//   const odds = await this.getOdds();
    const odds = (await this.odds.first().innerText())?.trim() || null;
  return {
    value: odds,
    time: performance.now(),
  };
}


  async placeBet(stake = '10') {
    await this.odds.first().click();
    await this.page.fill('input[aria-label="Stake"]', stake);
    await this.page.click('button:has-text("Place Bet")');
  }

  async getMatchedOdds(): Promise<string | null> {
    const locator = this.page.locator('.placed-bets .bet-odds').first();
    await locator.waitFor({ timeout: 10000 });
    return (await locator.textContent())?.trim() || null;
  }
}
