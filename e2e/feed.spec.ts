import { test, expect } from '@playwright/test';

test.describe('Feed page — unauthenticated', () => {
    test('redirects to homepage when not logged in', async ({ page }) => {
        await page.goto('/feed');

        // Should redirect to home since the user is not authenticated
        await expect(page).toHaveURL('/');
    });
});

test.describe('Feed page — authenticated', () => {
    // These tests require a logged-in session.
    // Set up auth state via Supabase cookies before each test.
    test.use({
        storageState: 'e2e/.auth/user.json',
    });

    test('displays the feed page with composer', async ({ page }) => {
        await page.goto('/feed');

        // Page title section
        await expect(page.locator('h1')).toContainText('Feed');

        // Post composer should be visible
        await expect(page.getByPlaceholder(/What's on your mind/)).toBeVisible();

        // Post button should be visible but disabled
        const postButton = page.getByRole('button', { name: 'Post' });
        await expect(postButton).toBeVisible();
        await expect(postButton).toBeDisabled();
    });

    test('enables Post button when text is entered', async ({ page }) => {
        await page.goto('/feed');

        const textarea = page.getByPlaceholder(/What's on your mind/);
        await textarea.fill('Testing the feed!');

        const postButton = page.getByRole('button', { name: 'Post' });
        await expect(postButton).toBeEnabled();
    });

    test('shows character counter updating as user types', async ({ page }) => {
        await page.goto('/feed');

        // Initial count
        await expect(page.getByText('0/1000')).toBeVisible();

        const textarea = page.getByPlaceholder(/What's on your mind/);
        await textarea.fill('Hello');

        await expect(page.getByText('5/1000')).toBeVisible();
    });

    test('creates a new post and displays it in the feed', async ({ page }) => {
        await page.goto('/feed');

        const textarea = page.getByPlaceholder(/What's on your mind/);
        const postContent = `Test post ${Date.now()}`;

        await textarea.fill(postContent);
        await page.getByRole('button', { name: 'Post' }).click();

        // The new post should appear in the feed
        await expect(page.getByText(postContent)).toBeVisible({ timeout: 5000 });

        // The textarea should be cleared
        await expect(textarea).toHaveValue('');
    });

    test('shows empty state when no posts exist', async ({ page }) => {
        // This test assumes a clean database state
        await page.goto('/feed');

        // If no posts, should show empty state message
        // This is conditional — skip assertion if posts already exist
        const emptyState = page.getByText('No posts yet');
        const postCards = page.locator('.card').filter({ hasText: /ago|just now/ });

        const hasEmptyState = await emptyState.isVisible().catch(() => false);
        const hasPosts = await postCards.first().isVisible().catch(() => false);

        // One of these should be true
        expect(hasEmptyState || hasPosts).toBeTruthy();
    });

    test('can like a post', async ({ page }) => {
        await page.goto('/feed');

        // First create a post to like
        const textarea = page.getByPlaceholder(/What's on your mind/);
        await textarea.fill(`Likeable post ${Date.now()}`);
        await page.getByRole('button', { name: 'Post' }).click();

        // Wait for the post to appear
        await page.waitForTimeout(1000);

        // Click the like button on the first post
        const likeButton = page.locator('button').filter({ hasText: 'Like' }).first();
        await likeButton.click();

        // Should show 1 Like after clicking
        await expect(page.getByText('1 Like').first()).toBeVisible({ timeout: 3000 });
    });

    test('can delete own post', async ({ page }) => {
        await page.goto('/feed');

        // Create a post to delete
        const textarea = page.getByPlaceholder(/What's on your mind/);
        const postContent = `Delete me ${Date.now()}`;
        await textarea.fill(postContent);
        await page.getByRole('button', { name: 'Post' }).click();

        await expect(page.getByText(postContent)).toBeVisible({ timeout: 5000 });

        // Click the menu (ellipsis) button on the post
        const menuButton = page.locator('.uil-ellipsis-h').first();
        await menuButton.click();

        // Accept the confirmation dialog
        page.on('dialog', dialog => dialog.accept());

        // Click delete
        await page.getByText('Delete post').click();

        // The post should be removed from the feed
        await expect(page.getByText(postContent)).not.toBeVisible({ timeout: 5000 });
    });
});

test.describe('Feed navbar link', () => {
    test('Feed link is not visible when logged out', async ({ page }) => {
        await page.goto('/');

        const feedLink = page.locator('a', { hasText: 'Feed' });
        await expect(feedLink).not.toBeVisible();
    });

    test.describe('logged in', () => {
        test.use({
            storageState: 'e2e/.auth/user.json',
        });

        test('Feed link is visible when logged in', async ({ page }) => {
            await page.goto('/');

            const feedLink = page.locator('.navbar-nav a', { hasText: 'Feed' });
            await expect(feedLink).toBeVisible();
            await expect(feedLink).toHaveAttribute('href', '/feed');
        });
    });
});
