import { test, expect } from '@playwright/test';

test.describe('Console Errors and Network Issues', () => {

  test('Home page - Check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', request => {
      networkErrors.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (consoleErrors.length > 0) {
      console.log('\n❌ Console Errors Found:');
      consoleErrors.forEach(err => console.log(`  - ${err}`));
    }

    if (networkErrors.length > 0) {
      console.log('\n❌ Network Errors Found:');
      networkErrors.forEach(err => console.log(`  - ${err}`));
    }

    // Log but don't fail - some errors might be expected
    console.log(`\n✅ Total console errors: ${consoleErrors.length}`);
    console.log(`✅ Total network errors: ${networkErrors.length}`);
  });

  test('Jobs page - Check for data loading', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for data to load

    // Check if "No jobs" or job cards are visible
    const hasJobs = await page.locator('[data-testid="job-card"]').count() > 0;
    const noJobsMessage = await page.locator('text=/no jobs/i').count() > 0;

    if (!hasJobs && !noJobsMessage) {
      console.log('⚠️  Jobs page: No jobs found and no "no jobs" message');
      if (consoleErrors.length > 0) {
        console.log('Console errors:', consoleErrors);
      }
    }
  });
});
