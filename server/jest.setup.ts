// Jest setup file - runs before all tests
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.MONGODB_URI = 'mongodb://localhost:27017/vtc-test';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
process.env.GMAIL_USER = 'test@example.com';
process.env.GMAIL_PASS = 'test_password';
process.env.RECIPIENT_EMAIL = 'recipient@example.com';
process.env.CLIENT_URL = 'http://localhost:3000';

// Global test timeout
jest.setTimeout(10000);

// Suppress console.log during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
