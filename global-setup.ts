import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default async function globalSetup() {
  const { CARTO_LOGIN_URL, CARTO_EMAIL, CARTO_PASSWORD } = process.env;

  if (!CARTO_LOGIN_URL || !CARTO_EMAIL || !CARTO_PASSWORD) {
    console.warn('CARTO_* env vars not set. Skipping login; UI tests may fail.');
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(CARTO_LOGIN_URL);

  // Adjust these after first run if labels differ:
  await page.locator('#username').fill(CARTO_EMAIL);
  await page.locator('#password').fill(CARTO_PASSWORD);

  await Promise.all([
    page.locator('button[data-action-button-primary="true"]').click(),
    page.waitForLoadState('networkidle')
  ]);

  await context.storageState({ path: 'storageState.json' });
  await browser.close();
}
