// Utility file to create mock Mongoose instances for testing
import { jest } from "@jest/globals";

export const createMockModel = <T = Record<string, unknown>>() => {
    class MockModel {
        constructor(public data: T) {}

        static find = jest.fn((..._args: unknown[]) => Promise.resolve([]));
        static findById = jest.fn((..._args: unknown[]) =>
            Promise.resolve(null)
        );
        static findOne = jest.fn((..._args: unknown[]) =>
            Promise.resolve(null)
        );
        static create = jest.fn((data: T) => Promise.resolve(data));
        static updateOne = jest.fn((..._args: unknown[]) =>
            Promise.resolve({ modifiedCount: 1 })
        );
        static deleteOne = jest.fn((..._args: unknown[]) =>
            Promise.resolve({ deletedCount: 1 })
        );
        static countDocuments = jest.fn((..._args: unknown[]) =>
            Promise.resolve(0)
        );
        static findByIdAndUpdate = jest.fn((..._args: unknown[]) =>
            Promise.resolve({ id: "mock-id" })
        );
        static findByIdAndDelete = jest.fn((..._args: unknown[]) =>
            Promise.resolve({ deletedCount: 1 })
        );

        save = jest.fn(() => Promise.resolve(this.data));
        remove = jest.fn(() => Promise.resolve(this.data));
        deleteOne = jest.fn(() => Promise.resolve(this.data));
        updateOne = jest.fn((..._args: unknown[]) =>
            Promise.resolve({ ...this.data })
        );
    }

    return MockModel;
};

export const createMockMongoose = () => {
    const mockConnection = {
        readyState: 1, // connected
        on: jest.fn(),
        once: jest.fn(),
        close: jest.fn(() => Promise.resolve()),
    };

    return {
        connect: jest.fn((..._args: unknown[]) =>
            Promise.resolve({ connection: mockConnection })
        ),
        disconnect: jest.fn(() => Promise.resolve()),
        connection: mockConnection,
        Schema: jest.fn((definition: unknown) => ({
            definition,
            methods: {},
            statics: {},
            virtuals: {},
        })),
        model: jest.fn((..._args: unknown[]) => createMockModel()),
        models: {},
        Types: {
            ObjectId: jest.fn((id?: string) => id || "mock-object-id"),
        },
    };
};
