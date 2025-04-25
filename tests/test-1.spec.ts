import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
  await expect(page.locator('.m_e615b15f > div:nth-child(5)')).toBeVisible();
});