import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
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

const lostItemSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        lostDate: {
            type: Date,
            required: true,
        },
        lostLocation: {
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

const matchItemSchema = new mongoose.Schema(
    {
        lostItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LostItems",
            required: true,
        },
        foundItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoundItems",
            required: true,
        },
        matchedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
    },
    { timestamps: true },
);

export const FoundItem = mongoose.model("FoundItems", foundItemSchema);
export const LostItem = mongoose.model("LostItems", lostItemSchema);
export const MatchItem = mongoose.model("MatchItems", matchItemSchema);
