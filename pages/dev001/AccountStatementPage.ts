import { Page, Locator, expect } from '@playwright/test';

export class AccountStatementPage {

  readonly page: Page;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;

  constructor(page: Page) {
    this.page = page;

    // Stable main table locator
    this.table = page.locator('table');

    this.tableHeaders = this.table.locator('thead th');
    this.tableRows = this.table.locator('tbody tr');
  }

  // =============================
  // 🔹 Navigate
  // =============================
  async navigateToAccountStatement() {
    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await this.page.getByRole('menuitem', { name: 'Account Statement' }).click();
  }

  // =============================
  // 🔹 Verify Page Loaded
  // =============================
  async verifyPageLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Account Statement' }))
      .toBeVisible({ timeout: 60000 });
  }

  async filterByLast15Days() {
  await this.page.getByRole('combobox', { name: 'Just for Today' }).locator('svg').click();
  await this.page.getByText('Last 15 days').click();
  }

  // =============================
  // 🔹 Verify Columns
  // =============================
  async verifyColumnsDisplayed() {
  console.log('\n🧾 Verifying table columns...');
    const expectedHeaders = [
      'Bet ID',
      'Settled',
      'Matched',
      'Description',
      'Type',
      'Odds',
      'Price',
      'Stake',
      'Status',
      'Debit',
      'Credit',
      'Balance'
    ];

    for (const header of expectedHeaders) {
      await expect(
        this.table.getByRole('columnheader', { name: header })
      ).toBeVisible();
      console.log(`   ✔ Column verified: ${header}`);
    }
    
  

  console.log('✅ All required columns are displayed');
  }

  // =============================
  // 🔹 Verify At Least One Row
  // =============================
  async verifyTransactionsExist() {
    
    const rowCount = await this.tableRows.count();
    console.log(`\n📊 Found ${rowCount} transaction(s) in table`);
    expect(rowCount).toBeGreaterThan(0);
  }

  // =============================
  // 🔹 Validate First Row Structure
  // =============================
  async verifyFirstRowStructure() {

    const firstRow = this.tableRows.first();
    const cells = firstRow.locator('td');

    // We expect 12 columns
    await expect(cells).toHaveCount(12);
  }

  // =============================
  // 🔹 Verify No Duplicate Bet IDs
  // =============================
  async verifyNoDuplicateBetIds() {
  console.log('\n🔍 Checking for duplicate Bet IDs...');
    const betIdCells = this.tableRows.locator('td:nth-child(1)');
    const count = await betIdCells.count();

    const ids: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await betIdCells.nth(i).innerText()).trim();
      if (text !== '--') ids.push(text);
    }

    const unique = new Set(ids);

    expect(unique.size).toBe(ids.length);
    console.log(`   ✔ Checked ${ids.length} Bet IDs`);
   console.log('✅ No duplicate Bet IDs found');
  }

  // =============================
  // 🔹 Verify Balance Calculation
  // =============================
  async verifyBalanceFlow() {
console.log('\n💰 Verifying running balance consistency...');
  const rowCount = await this.tableRows.count();

  let previousBalance: number | null = null;

  for (let i = rowCount - 1; i >= 0; i--) {

    const row = this.tableRows.nth(i);

    const debit = await this.getNumericCell(row, 10);
    const credit = await this.getNumericCell(row, 11);
    const balance = await this.getNumericCell(row, 12);

    if (previousBalance !== null) {

      const expected = previousBalance - debit + credit;

      expect(balance).toBeCloseTo(expected, 2);

       console.log(
        `      ✔ Balance validated (Expected: ${expected})`
      );
    }

    previousBalance = balance;
  }
  console.log('✅ Balance flow verified successfully');
}
  // =============================
  // 🔹 Utility: Convert currency cell to number
  // =============================
  private async getNumericCell(row: Locator, columnIndex: number): Promise<number> {

    const text = await row.locator(`td:nth-child(${columnIndex})`).innerText();

    return parseFloat(
      text.replace(/[^0-9.-]+/g, '')
    ) || 0;
  }

}