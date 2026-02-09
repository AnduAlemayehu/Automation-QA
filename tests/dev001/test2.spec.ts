import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://dev-desktop.freedemokit.com/login');
//   await page.getByRole('textbox', { name: 'Username' }).click();
//   await page.getByRole('textbox', { name: 'Username' }).fill('john');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('John@123');
//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByRole('link', { name: 'In-Play', exact: true }).click();
//   await page.getByText('Betslip download').click();
//   await page.locator('app-open-bets').getByText('Betslip').click();
//   await page.locator('#mat-expansion-panel-header-4').click();
//   await page.locator('#cdk-accordion-child-4').getByText('Match Odds').click();
//   await page.getByText('ID: 75560').click();
//   await page.locator('#mat-expansion-panel-header-5').click();
//   await page.locator('#cdk-accordion-child-5').getByText('Match Odds').click();
//   await page.getByText('ID: 75559').click();
//   await page.locator('#mat-expansion-panel-header-6').click();
//   await page.locator('#cdk-accordion-child-6').getByText('Match Odds').click();
//   await page.getByText('ID: 75558').click();
// });
// import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev-desktop.freedemokit.com/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('john');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('John@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Western Australia 1.59 100.00' }).click();
  await page.getByText('ID: 75539').dblclick();
  await page.getByText('Western Australia 1.59 100.00 59.00 Most Points ID: 75539 Bet ID: 417402518787').click();
  await page.getByText('ID: 75539').click();
  await page.getByText('Western Australia 1.59 100.00 59.00 Most Points ID: 75539 Bet ID: 417402518787').click();
  await page.getByLabel('Western Australia 1.59 100.00').getByText('Most Points').dblclick();
  await page.getByText('ID: 75539').click();
  await page.locator('app-open-bets').getByText('Betslip').click();
  await page.locator('mat-drawer').filter({ hasText: 'Betslip download Main Market' }).click();
  await page.getByRole('link', { name: 'In-Play', exact: true }).click();
  await page.getByText('Wellington Phoenix 20.00 100.00 1,900.00 Match Odds ID: 75588 Bet ID:').dblclick();
  await page.getByRole('button', { name: 'Wellington Phoenix 20.00 100.00' }).dblclick();
  await page.getByText('Wellington Phoenix 20.00 100.00 1,900.00 Match Odds ID: 75588 Bet ID:').click();
  await page.getByText('ID: 75588').dblclick();
  await page.getByRole('button', { name: 'Wellington Phoenix 17.50 100.00' }).click();
  await page.getByText('ID: 75587').click();
  await page.getByText('ID: 75587').click();
  await page.getByText('ID: 75587').click();
  console.log(
  await page.locator('app-open-bets').getByText('Betslip').locator('div.bet-details').getByText(/^ID:\s*\d+$/).allInnerTexts()
);

console.log(
  await page
    .locator('div.bet-details')
    .locator('b').first()

    .allInnerTexts()
);

// console.log(await page.locator("//div[@id='cdk-accordion-child-38']//b[1]").innerText());
});