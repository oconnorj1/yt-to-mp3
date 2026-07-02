import { test, expect } from '@playwright/test';

test.describe('yt-to-mp3', () => {
  test('page loads with title and form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('yt-to-mp3');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Download');
  });

  test('shows error for invalid URL', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[type="text"]');
    await input.fill('not-a-valid-url');
    await page.locator('button[type="submit"]').click();

    // The backend validates URL format, so we should see an error
    await expect(page.locator('text=Invalid URL')).toBeVisible({ timeout: 15_000 });
  });

  test('button is disabled when input is empty', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button[type="submit"]');
    await expect(button).toBeDisabled();
  });

  test('downloads MP3 for a valid YouTube URL', async ({ page }) => {
    await page.goto('/');

    const downloadPromise = page.waitForEvent('download', { timeout: 120_000 });

    const input = page.locator('input[type="text"]');
    await input.fill('https://www.youtube.com/watch?v=VCuS3enPwKI');
    await page.locator('button[type="submit"]').click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.mp3$/i);
  });
});
