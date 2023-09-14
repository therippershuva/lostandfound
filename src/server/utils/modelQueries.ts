const User from "../models/User");
const Token from "../models/Token");
import mongoose from "mongoose";

export const findOneUser = async (userId) => {
    try {
        // console.log(userId);
        const userFound = await User.findOne({ _id: userId });
        return userFound;
    } catch (error: Error | any) {
      if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};
