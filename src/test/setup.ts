import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'jest-fetch-mock';
import { setupMocks } from './mocks';

// Setup all mocks
setupMocks();

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
}); 