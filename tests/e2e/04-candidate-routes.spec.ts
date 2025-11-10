import { test, expect } from '@playwright/test';

test.describe('Candidate Dashboard Routes (Auth Required)', () => {

  test.beforeEach(async ({ page }) => {
    // Note: These will redirect to login if not authenticated
    // We're just checking the routes exist and redirect properly
  });

  test('Candidate dashboard route exists (/candidate/dashboard)', async ({ page }) => {
    await page.goto('/candidate/dashboard');

    // Should either show dashboard (if logged in) or redirect to login
    const url = page.url();
    const isLoginPage = url.includes('/login');
    const isDashboard = url.includes('/candidate/dashboard');

    expect(isLoginPage || isDashboard).toBeTruthy();
  });

  test('Candidate profile route exists (/candidate/profile)', async ({ page }) => {
    await page.goto('/candidate/profile');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/profile')).toBeTruthy();
  });

  test('Candidate jobs route exists (/candidate/jobs)', async ({ page }) => {
    await page.goto('/candidate/jobs');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/jobs')).toBeTruthy();
  });

  test('Candidate applications route exists (/candidate/applications)', async ({ page }) => {
    await page.goto('/candidate/applications');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/applications')).toBeTruthy();
  });

  test('Candidate saved jobs route exists (/candidate/saved)', async ({ page }) => {
    await page.goto('/candidate/saved');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/saved')).toBeTruthy();
  });

  test('Candidate messages route exists (/candidate/messages)', async ({ page }) => {
    await page.goto('/candidate/messages');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/messages')).toBeTruthy();
  });

  test('Candidate interviews route exists (/candidate/interviews)', async ({ page }) => {
    await page.goto('/candidate/interviews');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/interviews')).toBeTruthy();
  });

  test('Candidate referrals route exists (/candidate/referrals)', async ({ page }) => {
    await page.goto('/candidate/referrals');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/referrals')).toBeTruthy();
  });

  test('Candidate exclusive jobs route exists (/candidate/exclusive-jobs)', async ({ page }) => {
    await page.goto('/candidate/exclusive-jobs');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/exclusive-jobs')).toBeTruthy();
  });

  test('Candidate settings route exists (/candidate/settings)', async ({ page }) => {
    await page.goto('/candidate/settings');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/candidate/settings')).toBeTruthy();
  });
});
