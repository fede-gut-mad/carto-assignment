import {Page, expect} from '@playwright/test';

export async function login(page: Page) {
    const BASE_URL  = process.env.CARTO_BASE_URL || 'https://pinea.app.carto.com/';
    const CARTO_LOGIN_URL = process.env.CARTO_LOGIN_URL || 'https://carto.com';
    const EMAIL     = process.env.CARTO_EMAIL || '';
    const PASSWORD  = process.env.CARTO_PASSWORD || '';
  
    if (!EMAIL || !PASSWORD) {
      throw new Error('Missing CARTO_EMAIL or CARTO_PASSWORD in .env');
    }
  
    // Open log in page
    await page.goto( CARTO_LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('a.login-button').click();
    await page.waitForLoadState('domcontentloaded');
  
    // Fill credentials
    await page.locator('#username').fill(`${process.env.CARTO_EMAIL}`);
    await page.locator('#password').fill(`${process.env.CARTO_PASSWORD}`);
  
    // Submit and wait for network to settle
    const submit = page.locator('button[data-action-button-primary="true"]').first();
    await Promise.all([
      submit.click(),
      page.waitForLoadState('domcontentloaded')
    ]);
  
    // Land on home page check
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('https://pinea.app.carto.com');
  }

