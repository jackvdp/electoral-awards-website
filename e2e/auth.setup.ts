import { test as setup, expect } from '@playwright/test';

/**
 * Authentication setup for Playwright e2e tests.
 *
 * Before running authenticated tests, you must generate the auth state file:
 *
 * 1. Start the dev server: `npm run dev`
 * 2. Run this setup: `npx playwright test auth.setup.ts`
 *    — OR log in manually in a Playwright browser and save state:
 *    `npx playwright codegen --save-storage=e2e/.auth/user.json http://localhost:3000`
 *
 * This saves Supabase session cookies to `e2e/.auth/user.json` which is
 * then reused by test files that specify `storageState: 'e2e/.auth/user.json'`.
 *
 * The auth file is gitignored to avoid committing credentials.
 */
setup('authenticate', async ({ page }) => {
    // Navigate to the site
    await page.goto('/');

    // Open the sign-in modal
    await page.getByText('Sign In').click();

    // Fill in credentials from environment variables
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required.\n' +
            'Set them before running: TEST_USER_EMAIL=you@example.com TEST_USER_PASSWORD=secret npx playwright test auth.setup.ts'
        );
    }

    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for auth to complete — Account link appears in navbar
    await expect(page.getByText('Account')).toBeVisible({ timeout: 10000 });

    // Save the authenticated state
    await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
