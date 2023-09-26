import { Request, Response } from "express";

import { env } from "../../env";
import { User } from "../models/User.models";

// import bcrypt from "bcrypt";
// import { updateUserValidation } from "../middlewares/validation";
// import {
//     nonExistenceError,
//     validationError,
//     wrongPwError,
// } from "../utils/errorMessages";
// import { profileAvatarCoverDelete } from "../utils/fileHandling";
// import { TMulterFile } from "../middlewares/fileUpload";

////////////            ! USER methods          ////////////

////////////          ? READ          ////////////

/** ### Retrieve list of users
 */
export const users_get = async (req: Request, res: Response) => {
    try {
        // for millions of users and customized use async iterator method method
        const users = [];
        for await (const doc of User.find()) {
            users.push({
                _id: doc._id,
                username: doc.username,
                email: doc.email,
                firstName: doc.firstName,
                middleName: doc.middleName,
                lastName: doc.lastName,
                dateOfBirth: doc.dateOfBirth,
                details: doc.details,
                avatarImage: doc.avatarImage,
                coverImage: doc.coverImage,
            });
        }

        return res.send(users);
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

/** ### Recieve details ofmultiple  users
 *
 * POST body: { userGroup: [_id1, _id2, _id3, ...],}
 */
export const group_users_post = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ _id: { $in: req.body.userGroup } });
        if (!users)
            throw {
                status: 404,
                type: "Non-existence",
                message: "No Users found for given array of ids",
            };

        const group = [];
        for (let doc of users)
            group.push({
                _id: doc._id,
                username: doc.username,
                email: doc.email,
                firstName: doc.firstName,
                middleName: doc.middleName,
                lastName: doc.lastName,
                dateOfBirth: doc.dateOfBirth,
                details: doc.details,
                avatarImage: doc.avatarImage,
                coverImage: doc.coverImage,
            });

        return res.status(200).send(group);
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

/** ### Recieve User Details
 */
export const user_detail_private_get = async (req: Request, res: Response) => {
    try {
        const userExists = await User.findOne({ _id: req.params.userId });
        if (!userExists)
            throw {
                status: 404,
                type: "Non-existence",
                message: "The user does not exist",
            };

        return res.status(200).send(userExists);
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

/** ### Retrieve Detail of particular user */
export const user_detail_get = async (req: Request, res: Response) => {
    try {
        // const userExists = await findOneUser(req.params.userId);
        const userExists = await User.findOne({ _id: req.params.userId });
        if (!userExists)
            throw {
                status: 404,
                type: "Non-existence",
                message: "The user does not exist",
            };

        const user = {
            id: userExists._id,
            username: userExists.username,
            email: userExists.email,
            displayName: `${userExists.firstName} ${userExists.lastName}`,
            dateOfBirth: userExists.dateOfBirth,
            details: userExists.details,
            avatarImage: userExists.avatarImage,
            coverImage: userExists.coverImage,
        };

        return res.status(200).send(user);
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

////////////          ? UPDATE         ////////////

/**
 * GET /
 * New User Form
 */
export const addUser = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    return res.render("user/add", { req, res });
};

/**
 * POST /
 * Create New User
 */
export const postUser = async (req: Request, res: Response) => {
    console.log(req.body);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email,
    });

    try {
        await User.create(newUser);
        res.flash("info", "New user has been added.");

        return res.redirect("/");
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * User Data
 */
export const view = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        const locals = {
            title: "home",
            description: "Free NodeJs User Management System",
        };

        return res.render("user/view", {
            locals,
            user,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * Edit User Data
 */
export const edit = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        const locals = {
            title: "home",
            description: "Free NodeJs User Management System",
        };

        return res.render("user/edit", {
            locals,
            user,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * Update User Data
 */
export const editUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now(),
        });
        return res.redirect(`/edit/${req.params.id}`);
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * Delete /
 * Delete User Data
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        return res.redirect("/");
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * Get /
 * Search User Data
 */
export const searchUsers = async (req: Request, res: Response) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const users = await User.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ],
        });

        return res.render("search", {
            users,
            locals,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};
