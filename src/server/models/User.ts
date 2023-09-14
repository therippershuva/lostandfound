import mongoose from "mongoose";

const userSchema = new mongoose.Schema<TUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 6,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 6,
            maxLength: 255,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 1024,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        firstName: {
            type: String,
            maxLength: 100,
            default: null,
        },
        middleName: {
            type: String,
            maxLength: 100,
            default: null,
        },
        lastName: {
            type: String,
            maxLength: 100,
            default: null,
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        bio: {
            type: String,
            maxLength: 1000,
            default: null,
        },
        avatarImage: {
            type: String,
            default: null,
        },
        coverImage: {
            type: String,
            default: null,
        },
        // ROLES

        role: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 16,
            default: "user",
        },
    },
    { timestamps: true },
);

export type TUser = mongoose.Document & {
    username: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    bio?: string;
    avatarImage?: string;
    coverImage?: string;
    role: string;
};

export const User = mongoose.model("User", userSchema);
