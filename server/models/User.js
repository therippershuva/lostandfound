const mongoose = require("mongoose");

//
//
// USER SCHEMA
const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 6,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 6,
            maxlength: 255,
        },
        password: { type: String, required: true, max: 1024, minlength: 8 },
        isEmailVerified: { type: Boolean, default: false },
        firstName: { type: String, maxlength: 100, default: null },
        middleName: { type: String, maxlength: 100, default: null },
        lastName: { type: String, maxlength: 100, default: null },
        dateOfBirth: { type: Date, default: null, max: Date.now },

        // ROLES

        role: { type: String, required: true, length: 16, default: "user" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); // creates a new model based on userSchema named as User
