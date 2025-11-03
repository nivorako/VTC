// Mock implementation of Stripe for testing
import { jest } from '@jest/globals';

const mockPaymentIntentCreate = jest.fn(() => Promise.resolve({
  id: 'pi_mock_123456789',
  client_secret: 'pi_mock_secret_123456789',
  amount: 5000,
  currency: 'eur',
  status: 'requires_payment_method',
  created: Date.now(),
  payment_method_types: ['card'],
})) as jest.Mock;

const mockPaymentIntentRetrieve = jest.fn(() => Promise.resolve({
  id: 'pi_mock_123456789',
  status: 'succeeded',
  amount: 5000,
  currency: 'eur',
  payment_method: 'pm_mock_card',
})) as jest.Mock;

const mockPaymentIntentUpdate = jest.fn(() => Promise.resolve({
  id: 'pi_mock_123456789',
  status: 'succeeded',
  amount: 5000,
  currency: 'eur',
})) as jest.Mock;

const mockPaymentIntentCancel = jest.fn(() => Promise.resolve({
  id: 'pi_mock_123456789',
  status: 'canceled',
  amount: 5000,
  currency: 'eur',
})) as jest.Mock;

const mockCustomerCreate = jest.fn(() => Promise.resolve({
  id: 'cus_mock_123456789',
  email: 'test@example.com',
  name: 'Test User',
  created: Date.now(),
})) as jest.Mock;

const mockCustomerRetrieve = jest.fn(() => Promise.resolve({
  id: 'cus_mock_123456789',
  email: 'test@example.com',
  name: 'Test User',
})) as jest.Mock;

class MockStripe {
  paymentIntents = {
    create: mockPaymentIntentCreate,
    retrieve: mockPaymentIntentRetrieve,
    update: mockPaymentIntentUpdate,
    cancel: mockPaymentIntentCancel,
  };

  customers = {
    create: mockCustomerCreate,
    retrieve: mockCustomerRetrieve,
  };

  constructor(public apiKey: string, public config?: Record<string, unknown>) {}
}

// Export the mock class as default
export default MockStripe;

// Export individual mocks for testing purposes
export {
  mockPaymentIntentCreate,
  mockPaymentIntentRetrieve,
  mockPaymentIntentUpdate,
  mockPaymentIntentCancel,
  mockCustomerCreate,
  mockCustomerRetrieve,
};
