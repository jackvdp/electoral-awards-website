import { test as setup, expect } from '@playwright/test';

/**
 * Authentication setup for Playwright e2e tests.
 *
 * Requires TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.
 * Saves Supabase session cookies to e2e/.auth/user.json.
 */
setup('authenticate', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required.'
        );
    }

    await page.goto('/');

    // Click the Sign In button in the navbar (desktop, not offcanvas)
    await page.locator('.navbar-other').getByText('Sign In').click();

    // Wait for the modal to appear
    await page.locator('#modal-signin').waitFor({ state: 'visible' });

    // Fill in the password tab form
    await page.locator('#loginEmail').fill(email);
    await page.locator('#loginPassword').fill(password);
    await page.locator('#tab-password').getByRole('button', { name: 'Sign In' }).click();

    // Wait for auth to complete — Account link appears in navbar
    await expect(page.locator('.navbar-other').getByText('Account')).toBeVisible({ timeout: 10000 });

    // Save the authenticated state
    await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
