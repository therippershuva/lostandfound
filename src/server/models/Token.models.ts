import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema<TToken>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    usage: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 600,
    },
});

export type TToken = mongoose.Document & {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
    usage: string;
    createdAt: Date;
};

export const Token = mongoose.model("Token", tokenSchema);
