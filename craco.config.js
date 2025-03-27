const path = require('path');
module.exports = {
    devServer: {
        port: 3000,
    },
    style: {
        // postcss: {
        // },
    },
    webpack: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js'
            },
            setupFilesAfterEnv: [
                '<rootDir>/src/setupTests.ts'
            ],
            testEnvironment: 'jsdom',
            moduleDirectories: ['node_modules', 'src']
        },
    },
    typescript: {
        enableTypeChecking: true /* (default value) */,
    },
};
