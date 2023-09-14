import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },

        foundDate: {
            type: Date,
            required: true,
        },
        foundLocation: {
            type: String,
            required: true,
        },
        image: {
            type: Array,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: "Other",
        },
    },
    { timestamps: true },
);

const lostItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        lastSeenDate: {
            type: Date,
            required: true,
        },
        lastLocation: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: "Other",
        },
    },
    { timestamps: true },
);

export const FoundItem = mongoose.model("FoundItem", foundItemSchema);
export const LostItem = mongoose.model("LostItem", lostItemSchema);
