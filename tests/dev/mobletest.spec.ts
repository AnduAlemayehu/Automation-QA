import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev-mobile.freedemokit.com/login');
  
  await page.getByRole('textbox', { name: 'Username' }).fill('john');
  await page.getByRole('textbox', { name: 'Password' }).fill('john');
    await new Promise(resolve => setTimeout(resolve, 3000));
  await page.getByRole('button', { name: 'Login', exact: true }).click();
   await new Promise(resolve => setTimeout(resolve, 3000));

});