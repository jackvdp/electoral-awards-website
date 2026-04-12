/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    projects: [
        {
            displayName: 'unit',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/__tests__/use_cases/**/*.test.ts'],
            transform: {
                '^.+\\.tsx?$': ['ts-jest', {
                    tsconfig: 'tsconfig.jest.json',
                }],
            },
            moduleNameMapper: {
                '^backend/(.*)$': '<rootDir>/src/backend/$1',
            },
        },
        {
            displayName: 'components',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/__tests__/components/**/*.test.tsx'],
            transform: {
                '^.+\\.tsx?$': ['ts-jest', {
                    tsconfig: 'tsconfig.jest.json',
                }],
            },
            moduleNameMapper: {
                '^backend/(.*)$': '<rootDir>/src/backend/$1',
                '^components/(.*)$': '<rootDir>/src/components/$1',
                '^auth/(.*)$': '<rootDir>/src/auth/$1',
                '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
                '^helpers/(.*)$': '<rootDir>/src/helpers/$1',
                '^data/(.*)$': '<rootDir>/src/data/$1',
            },
            setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
        },
    ],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
};
