const User = require("../models/User");
const Token = require("../models/Token");
const mongoose = require("mongoose");

module.exports.findOneUser = async (_userId) => {
    try {
        // console.log(_userId);
        const userFound = await User.findOne({ _id: _userId });
        return userFound;
    } catch (error) {
        if (process.env.NODE_ENV === "dev") console.error(error);
    }
};
