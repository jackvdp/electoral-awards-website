import { defineConfig } from '@playwright/test';

// Make MONGODB_URI available to the test process for direct DB assertions.
// The Next.js dev server loads .env.local itself.
try {
    process.loadEnvFile('.env.local');
} catch {
    // Fine: env vars may already be set in the environment (e.g. CI).
}

export default defineConfig({
    testDir: './e2e',
    // E2E tests hit the real database and send real emails: run one at a time.
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: [['list']],
    timeout: 120_000,
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
        stdout: 'pipe',
    },
});
