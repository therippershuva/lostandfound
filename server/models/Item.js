const mongoose = require("mongoose");

const foundItemSchema = mongoose.Schema(
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
    { timestamps: true }
);

const lostItemSchema = mongoose.Schema(
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
    { timestamps: true }
);

module.exports.FoundItem = mongoose.model("FoundItem", foundItemSchema);
module.exports.LostItem = mongoose.model("LostItem", lostItemSchema);
