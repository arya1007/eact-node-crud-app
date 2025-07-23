const { test, expect } = require('@playwright/test');

test('successful login and item creation', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Login
  await page.fill('input[placeholder="Username"]', 'admin');
  await page.fill('input[placeholder="Password"]', '1234');
  await page.click('text=Login');

  // Add item
  await page.fill('input[placeholder="New item"]', 'TestItem123');
  await page.click('text=Add');

  // Check item in list
  await expect(page.locator('li')).toContainText('TestItem123');
});
