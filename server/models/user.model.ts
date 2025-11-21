import mongoose, { Document, Schema } from "mongoose";

// Types pour les sous-documents d'adresse
export interface Address {
    label: "home" | "work" | string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
}

// Type principal User
export interface IUser extends Document {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    provider: "local" | "google" | "facebook";
    providerId?: string;
    passwordHash?: string;
    role: "user" | "admin";
    addresses?: {
        home?: Address;
        work?: Address;
        // extensible pour d'autres types d'adresses si besoin
        [key: string]: Address | undefined;
    };
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<Address>(
    {
        label: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        phone: { type: String, trim: true },
        provider: {
            type: String,
            enum: ["local", "google", "facebook"],
            default: "local",
        },
        providerId: { type: String },
        passwordHash: { type: String },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        addresses: {
            home: { type: AddressSchema, required: false },
            work: { type: AddressSchema, required: false },
        },
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

// Index utile pour les recherches par provider/providerId
UserSchema.index({ provider: 1, providerId: 1 });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
