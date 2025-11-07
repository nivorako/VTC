// Utility file to create mock Stripe instances for testing
import { jest } from "@jest/globals";

export interface MockPaymentIntent {
    id: string;
    client_secret: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    payment_method_types: string[];
}

export interface MockCustomer {
    id: string;
    email: string;
    name: string;
    created: number;
}

export const createMockStripe = () => {
    const mockPaymentIntents = {
        create: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "pi_mock_123456789",
                client_secret: "pi_mock_secret_123456789",
                amount: 5000,
                currency: "eur",
                status: "requires_payment_method",
                created: Date.now(),
                payment_method_types: ["card"],
            } as MockPaymentIntent)
        ),

        retrieve: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "pi_mock_123456789",
                status: "succeeded",
                amount: 5000,
                currency: "eur",
                payment_method: "pm_mock_card",
            })
        ),

        update: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "pi_mock_123456789",
                status: "succeeded",
                amount: 5000,
                currency: "eur",
            })
        ),

        cancel: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "pi_mock_123456789",
                status: "canceled",
                amount: 5000,
                currency: "eur",
            })
        ),
    };

    const mockCustomers = {
        create: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "cus_mock_123456789",
                email: "test@example.com",
                name: "Test User",
                created: Date.now(),
            } as MockCustomer)
        ),

        retrieve: jest.fn((..._args: unknown[]) =>
            Promise.resolve({
                id: "cus_mock_123456789",
                email: "test@example.com",
                name: "Test User",
                created: Date.now(),
            } as MockCustomer)
        ),
    };

    return {
        paymentIntents: mockPaymentIntents,
        customers: mockCustomers,
    };
};

export const createMockPaymentIntent = (
    overrides?: Partial<MockPaymentIntent>
): MockPaymentIntent => ({
    id: "pi_mock_123456789",
    client_secret: "pi_mock_secret_123456789",
    amount: 5000,
    currency: "eur",
    status: "requires_payment_method",
    created: Date.now(),
    payment_method_types: ["card"],
    ...overrides,
});

export const createMockCustomer = (
    overrides?: Partial<MockCustomer>
): MockCustomer => ({
    id: "cus_mock_123456789",
    email: "test@example.com",
    name: "Test User",
    created: Date.now(),
    ...overrides,
});
