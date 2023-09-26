import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Customer = mongoose.model("Customer", CustomerSchema);
