const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  devServer: {
    port: 3000,
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
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      testEnvironment: 'jsdom',
      moduleDirectories: ['node_modules', 'src']
    },
  },
  typescript: {
    enableTypeChecking: true,
  },
};

// ✅ dev 환경에서만 babel 설정 추가
if (isDev) {
  config.babel = {
    plugins: ['react-refresh/babel'],
  };
}

module.exports = config;
