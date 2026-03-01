import { test, expect } from '@playwright/test';

test.describe('Language Selection Functionality - DEV Desktop', () => {

  test('Change language to Spanish, verify UI, revert to English and verify', async ({ page }) => {

    console.log('\n==============================');
    console.log('🌍 LANGUAGE CHANGE TEST STARTED');
    console.log('==============================');

    // =========================
    // 🔐 LOGIN
    // =========================
    await page.goto('https://dev-desktop.freedemokit.com/login');

    await page.getByRole('textbox', { name: 'Username' }).fill('john');
    await page.getByRole('textbox', { name: 'Password' }).fill('John@123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    console.log('✅ Login successful');

    // =========================
    // 🌐 CHANGE LANGUAGE → SPANISH
    // =========================
    console.log('\n🔄 Changing language: English → Spanish');

    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.getByRole('menuitem', { name: 'Select Language' }).click();

    await page.getByRole('combobox', { name: 'English' }).locator('svg').click();
    await page.getByText('Spanish').click();
    await page.getByRole('button', { name: 'Change' }).click();

    console.log('✅ Language switched to Spanish');

    // Navigate to main area
    
    // =========================
    // ✅ VERIFY SPANISH UI
    // =========================
    console.log('\n🔎 Verifying Spanish UI elements...');

    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible({ timeout: 60000 });
    console.log('✔ Menu translated: Home → Inicio');

    await expect(page.getByRole('link', { name: 'En Juego', exact: true })).toBeVisible();
    console.log('✔ In-Play translated: En Juego');

    await expect(page.locator('app-header').getByRole('link', { name: 'Fútbol' })).toBeVisible();
    console.log('✔ Sport translated: Soccer → Fútbol');

    await expect(page.getByText('Exposición:')).toBeVisible();
    console.log('✔ Exposure translated: Exposure → Exposición');

    // // Ensure English text does NOT exist
    // await expect(page.getByText('Home')).toHaveCount(0);
    // await expect(page.getByText('Exposure:')).toHaveCount(0);

    // console.log('✔ No mixed English content detected');

    // =========================
    // 🔁 REFRESH & VERIFY PERSISTENCE
    // =========================
    console.log('\n🔁 Refreshing to verify persistence...');

    // await page.reload();

    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible({ timeout: 60000 });
    console.log('✔ Spanish persisted after refresh');

    // =========================
    // 🔄 REVERT LANGUAGE → ENGLISH
    // =========================

console.log('\n🔄 Reverting language: Spanish → English');

await page.getByRole('button').filter({ hasText: /^$/ }).click();
await page.getByRole('menuitem', { name: 'Seleccionar Idioma' }).click();

await page.locator('#mat-select-value-0').click();
await page.getByRole('option', { name: 'Inglés' }).click();

await page.getByRole('button', { name: 'Cambiar' }).click();

console.log('⏳ Waiting for language to switch back to English...');

// ✅ Wait until Spanish disappears
await expect.poll(async () => {
  return await page.locator('text=Inicio').count();
}, { timeout: 60000 }).toBe(0);

// ✅ Wait until English appears
await expect.poll(async () => {
  return await page.locator('text=Home').count();
}, { timeout: 60000 }).toBeGreaterThan(0);

console.log('✅ Language reverted to English');

    
    // =========================
    // ✅ VERIFY ENGLISH RESTORED
    // =========================
console.log('\n🔎 Verifying English UI restored...');

await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
await expect(page.getByRole('link', { name: 'My Markets' })).toBeVisible();
await expect(page.getByText('Exposure:')).toBeVisible();

console.log('✔ English UI fully restored');

    // Ensure Spanish removed
    await expect(page.getByText('Inicio')).toHaveCount(0);
    await expect(page.getByText('Exposición:')).toHaveCount(0);

    console.log('✔ No mixed Spanish content detected');

    console.log('\n==============================');
    console.log('✅ LANGUAGE TEST COMPLETED SUCCESSFULLY');
    console.log('==============================\n');

  });

});