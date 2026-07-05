import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';

/**
 * End-to-end test of the nomination submission flow.
 *
 * This is deliberately NOT a mocked test: it drives the real form in a
 * browser, which hits /api/nominations, writes a real record to MongoDB and
 * sends the real confirmation/notification emails through Postmark.
 *
 * The created record is deleted again after the assertions pass, so the
 * database stays clean. Set KEEP_E2E_NOMINATION=1 to keep the record, e.g.
 * to inspect it on the account page or in MongoDB afterwards.
 */

const runId = Date.now();
const NOMINEE_NAME = `E2E Test Nominee ${runId}`;
const NOMINATOR_NAME = 'E2E Test Nominator';
// The nominator receives the real confirmation email, so use our own inbox.
const NOMINATOR_EMAIL = process.env.E2E_NOMINATOR_EMAIL || 'jack.vanderpump@publicpolicyexchange.co.uk';

const words = (count: number, label: string) =>
    `E2E test ${label}, safe to delete. ` +
    Array.from({ length: count }, (_, i) => `word${i}`).join(' ');

test('submitting the nomination form stores the nomination in MongoDB', async ({ page }) => {
    await page.goto('/awards/submit');

    // Step 1: Nominator
    await expect(page.getByRole('heading', { name: 'Nominator Information' })).toBeVisible();
    await page.locator('#nominatorName').fill(NOMINATOR_NAME);
    await page.locator('#nominatorOrganization').fill('E2E Test Organisation');
    await page.locator('#nominatorPosition').fill('E2E Test Position');
    await page.locator('#email').fill(NOMINATOR_EMAIL);
    await page.locator('#nominatorPhone').fill('+441234567890');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Nominee
    await expect(page.getByRole('heading', { name: 'Nominee Information' })).toBeVisible();
    await page.locator('#nomineeName').fill(NOMINEE_NAME);
    await page.locator('#nomineeEmail').fill('e2e-nominee@example.org');
    await page.locator('#nomineePhone').fill('+449876543210');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Category and description
    await expect(page.getByRole('heading', { name: 'Award Category and Initiative Description' })).toBeVisible();
    await page.locator('#awardCategory').selectOption({ index: 1 });
    const awardCategory = await page.locator('#awardCategory').inputValue();
    expect(awardCategory).not.toBe('');
    await page.locator('#initiativeDescription').fill(words(55, 'initiative description'));
    await page.locator('#supportingEvidence').fill(words(155, 'supporting evidence'));
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Reference (optional, skipped)
    await expect(page.getByRole('heading', { name: /Supporting Independent Reference/ })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Documents (optional, none) and submit
    await expect(page.getByRole('heading', { name: /Additional Documentation/ })).toBeVisible();
    const submitButton = page.getByRole('button', { name: 'Submit Application' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Real network round-trip: record saved, then confirmation/admin emails sent.
    await expect(page.getByText('Thank you for your submission!')).toBeVisible({ timeout: 30_000 });

    // Verify directly in MongoDB that the nomination was stored.
    await mongoose.connect(process.env.MONGODB_URI!);
    try {
        const collection = mongoose.connection.db!.collection('nominations');
        const record = await collection.findOne({ nomineeName: NOMINEE_NAME });

        expect(record).not.toBeNull();
        expect(record!.nominatorName).toBe(NOMINATOR_NAME);
        expect(record!.email).toBe(NOMINATOR_EMAIL);
        expect(record!.awardCategory).toBe(awardCategory);
        expect(record!.initiativeDescription).toContain('initiative description');
        expect(record!.supportingEvidence).toContain('supporting evidence');
        expect(record!.documents).toEqual([]);
        expect(record!.userId).toBeUndefined(); // submitted anonymously
        expect(record!.createdAt).toBeInstanceOf(Date);

        if (process.env.KEEP_E2E_NOMINATION) {
            console.log(`Keeping E2E nomination ${record!._id} (KEEP_E2E_NOMINATION set).`);
        } else {
            await collection.deleteOne({ _id: record!._id });
            console.log(`Deleted E2E nomination ${record!._id} after verification.`);
        }
    } finally {
        await mongoose.disconnect();
    }
});
