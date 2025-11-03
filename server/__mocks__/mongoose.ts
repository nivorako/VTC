// Mock implementation of mongoose for testing
import { jest } from '@jest/globals';

const mockConnect = jest.fn(() => Promise.resolve({
  connection: {
    db: {
      databaseName: 'vtc-test',
    },
  },
})) as jest.Mock;

const mockDisconnect = jest.fn(() => Promise.resolve(undefined)) as jest.Mock;

const mockSchema = jest.fn((definition) => {
  return {
    definition,
    methods: {},
    statics: {},
    virtuals: {},
  };
}) as jest.Mock;

const mockModel = jest.fn(() => {
  class MockModel {
    constructor(public data: Record<string, unknown>) {}

    static find = jest.fn(() => Promise.resolve([]));
    static findById = jest.fn(() => Promise.resolve(null));
    static findOne = jest.fn(() => Promise.resolve(null));
    static create = jest.fn((data: unknown) => Promise.resolve(data));
    static updateOne = jest.fn(() => Promise.resolve({ modifiedCount: 1 }));
    static deleteOne = jest.fn(() => Promise.resolve({ deletedCount: 1 }));
    static countDocuments = jest.fn(() => Promise.resolve(0));

    save = jest.fn(() => Promise.resolve(this.data));
    remove = jest.fn(() => Promise.resolve(this.data));
    deleteOne = jest.fn(() => Promise.resolve(this.data));
  }

  return MockModel;
}) as jest.Mock;

const mockConnection = {
  readyState: 1, // connected
  on: jest.fn(),
  once: jest.fn(),
  close: mockDisconnect,
};

export default {
  connect: mockConnect,
  disconnect: mockDisconnect,
  connection: mockConnection,
  Schema: mockSchema,
  model: mockModel,
  models: {},
  Types: {
    ObjectId: jest.fn((id?: string) => id || 'mock-object-id'),
  },
};

export {
  mockConnect,
  mockDisconnect,
  mockSchema,
  mockModel,
  mockConnection,
};
