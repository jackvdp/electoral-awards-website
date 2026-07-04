import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        // Resolve imports relative to the tsconfig baseUrl (./src)
        tsconfigPaths: true,
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
