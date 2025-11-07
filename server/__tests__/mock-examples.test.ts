import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import {
    createMockStripe,
    createMockPaymentIntent,
    createMockCustomer,
} from "./utils/mockStripe.js";
import { createMockMongoose, createMockModel } from "./utils/mockMongoose.js";

describe("Mock Examples - Stripe", () => {
    let mockStripe: ReturnType<typeof createMockStripe>;

    beforeEach(() => {
        mockStripe = createMockStripe();
        jest.clearAllMocks();
    });

    describe("Payment Intents", () => {
        it("should create a payment intent", async () => {
            const paymentIntent = await mockStripe.paymentIntents.create({
                amount: 5000,
                currency: "eur",
            });

            expect(mockStripe.paymentIntents.create).toHaveBeenCalled();
            expect(paymentIntent.id).toBeDefined();
            expect(paymentIntent.amount).toBe(5000);
            expect(paymentIntent.currency).toBe("eur");
        });

        it("should retrieve a payment intent", async () => {
            const paymentIntent =
                await mockStripe.paymentIntents.retrieve("pi_mock_123");

            expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith(
                "pi_mock_123"
            );
            expect(paymentIntent).toBeDefined();
        });

        it("should use payment intent factory", () => {
            const intent = createMockPaymentIntent({
                amount: 10000,
                status: "succeeded",
            });

            expect(intent.amount).toBe(10000);
            expect(intent.status).toBe("succeeded");
            expect(intent.currency).toBe("eur"); // default value
        });
    });

    describe("Customers", () => {
        it("should create a customer", async () => {
            const customer = await mockStripe.customers.create({
                email: "test@example.com",
                name: "Test User",
            });

            expect(mockStripe.customers.create).toHaveBeenCalled();
            expect(customer.email).toBe("test@example.com");
            expect(customer.name).toBe("Test User");
        });

        it("should use customer factory", () => {
            const customer = createMockCustomer({
                email: "custom@example.com",
            });

            expect(customer.email).toBe("custom@example.com");
            expect(customer.id).toBeDefined();
        });
    });
});

describe("Mock Examples - Mongoose", () => {
    let mockMongoose: ReturnType<typeof createMockMongoose>;

    beforeEach(() => {
        mockMongoose = createMockMongoose();
        jest.clearAllMocks();
    });

    describe("Connection", () => {
        it("should connect to database", async () => {
            await mockMongoose.connect("mongodb://localhost:27017/test");

            expect(mockMongoose.connect).toHaveBeenCalledWith(
                "mongodb://localhost:27017/test"
            );
            expect(mockMongoose.connection.readyState).toBe(1);
        });

        it("should disconnect from database", async () => {
            await mockMongoose.disconnect();

            expect(mockMongoose.disconnect).toHaveBeenCalled();
        });
    });

    describe("Model Operations", () => {
        interface User {
            _id?: string;
            name: string;
            email: string;
        }

        let MockUserModel: ReturnType<typeof createMockModel<User>>;

        beforeEach(() => {
            MockUserModel = createMockModel<User>();
        });

        it("should create a document", async () => {
            const userData = { name: "John Doe", email: "john@example.com" };
            const result = await MockUserModel.create(userData);

            expect(MockUserModel.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(userData);
        });

        it("should find documents", async () => {
            const result = await MockUserModel.find();

            expect(MockUserModel.find).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it("should find by id", async () => {
            await MockUserModel.findById("123");

            expect(MockUserModel.findById).toHaveBeenCalledWith("123");
        });

        it("should update a document", async () => {
            const result = await MockUserModel.updateOne({
                email: "new@example.com",
            });

            expect(MockUserModel.updateOne).toHaveBeenCalled();
            expect(result).toHaveProperty("modifiedCount", 1);
        });

        it("should delete a document", async () => {
            const result = await MockUserModel.deleteOne();

            expect(MockUserModel.deleteOne).toHaveBeenCalled();
            expect(result).toHaveProperty("deletedCount", 1);
        });

        it("should count documents", async () => {
            const count = await MockUserModel.countDocuments();

            expect(MockUserModel.countDocuments).toHaveBeenCalled();
            expect(count).toBe(0);
        });
    });

    describe("Schema", () => {
        it("should create a schema", () => {
            const definition = {
                name: String,
                email: String,
            };

            const schema = mockMongoose.Schema(definition);

            expect(mockMongoose.Schema).toHaveBeenCalledWith(definition);
            expect(schema).toBeDefined();
            expect(schema.definition).toEqual(definition);
        });
    });
});
