import { Page, Locator, expect } from '@playwright/test';

export class MobileInPlayPage {
  private odds: Locator;
  private searchBox : Locator;
  private stakeInput: Locator;
  private placeBetBtn: Locator;
  private successToast: Locator;
  private errorToast: Locator;
  private card: Locator;
  private market: Locator;
  private cell: Locator;


  constructor(private page: Page) {
    this.card = page.locator(
  'div.w-full.h-full.flex.flex-col.justify-center.items-center.gap-0.text-center.text-\\(--ion-color-dark\\).animated-color.cursor-pointer.back.primary'
).first();
    this.odds = page.locator('tr.market-runner-row td').nth(3);
    
    this.searchBox = page.getByRole('textbox', {name: 'Find team, markets, events'});

    this.stakeInput = page.getByRole('textbox', { name: /stake/i });
    this.placeBetBtn = page.getByRole('button', { name: /place bet/i });

    this.successToast = page.locator('text=/success|submitted|placed/i');
    this.errorToast = page.locator('text=/error|failed|rejected|suspended/i');
    this.market = page.locator(
  '#main-content > div > ion-router-outlet > app-event-detail > ion-content > div > div.w-full.h-fit.flex.flex-col.gap-1.pt-1.ng-star-inserted > div:nth-child(1) > app-collapsible.ng-tns-c1110580600-2.ng-star-inserted > div > div.w-full.overflow-hidden.ng-tns-c1110580600-2.ng-trigger.ng-trigger-animateCollapsible > app-odds-market-block > div > div:nth-child(3)'
);

this.cell = page.locator('app-cell button').first();
  }

  async openInPlayEvent() {
    // await this.page.goto('/in-play');
    // await this.page.getByRole('link', { name: 'In-Play', exact: true }).click();
    await this.page.getByText('In-Play', { exact: true }).click();
    console.log('mobile In-Play link clicked');
    // await this.page.locator('tr td:first-child a').first().click();
    // console.log('mobile event clicked');
  }

  async findLowLiquidityMarket(teamName: string) {


await this.searchBox.click();
await this.searchBox.fill(teamName);
await this.searchBox.press('Enter');


  await this.page.getByRole('list').getByText(teamName).click();

  }


  async getOddsData() {

    // locate the clickable card (parent)

console.log('entering Text1:');
//read text from ion-text inside
const text1 = (await this.card.locator('ion-text').first().innerText()).trim();
// const text2 = (await this.card.locator('ion-text').nth(2).innerText()).trim();

console.log('Text1:', text1);

const text2 = (await this.market.innerText()).trim();


console.log('Text2:', text2);



// read trimmed text
// const text = (await this.cell.locator('ion-text').innerText()).trim();
const text = (await this.cell
  .locator('ion-text.font-bold')
  .innerText()
).trim();

console.log('Text---:', text);


// click the parent (where click handler lives)
// await card.click();

//   const odds = (await this.odds.first().innerText())?.trim() || null;

// const button = this.page
//     .locator('app-cell button')
//     .filter({ has: this.page.locator('ion-text.font-bold') })
//     .first();

//   const text = (await button
//     .locator('ion-text.font-bold')
//     .innerText()
//   ).trim();

  const now = new Date();
  const time = `${now.toTimeString().split(' ')[0]}:${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`;

  return { value: text, time };
}


// to clik on odd value
// async clickOdds(){
//     // await this.card.nth(2).click();
//     //   await this.page.waitForTimeout(500);
      
// await this.market.scrollIntoViewIfNeeded();
// console.log('Market scrolled into view');
// await this.market.click();




// console.log('Market clicked');

// }

async clickOdds() {
  const button = this.page
    .locator('app-cell button')
    .filter({ has: this.page.locator('ion-text.font-bold') })
    .first();

  const odds = (await button
    .locator('ion-text.font-bold')
    .innerText()
  ).trim();

  console.log("odd-----",odds);

  await button.evaluate((el: HTMLElement) => el.click());

}





async placeBetOnce(stake: string): Promise<'SUCCESS' | 'ERROR' | 'NONE'> {
    console.log(`📝 Entering stake: ${stake}`);
    // await this.stakeInput.fill(stake);
     await this.page.getByPlaceholder('Stake').click();
  await this.page.getByPlaceholder('Stake').fill(stake);

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
 



  async getOdds(): Promise<string | null> {
    return (await this.odds.first().textContent())?.trim() || null;
  }
  async getOddsWithTimestamp() {
  const odds = await this.getOdds();
  return {
    value: odds,
    time: performance.now(),
  };
}


  async waitForOddsToResume(timeout = 5000): Promise<number> {
    const start = Date.now();
    await expect(this.odds.first()).toBeVisible({ timeout });
    return Date.now() - start;
  }
}
