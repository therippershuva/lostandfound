import { Request, Response } from "express";

import { env } from "../../env";
import { User } from "../models/User";

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
                bio: doc.bio,
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
                bio: doc.bio,
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
            bio: userExists.bio,
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

/**  Controls PROFILE UPDATE PATCH requests.
 *
 * PATCH body: { firstName: , middleName: , lastName: , bio: , dateOfBirth: , password: ,}
 */
// export const update_user_patch = async (req: Request, res: Response) => {
//     try {
//         const { error } = await updateUserValidation(req.body);
//         if (error) throw validationError(error);

//         const userToUpdate = await User.findOne({ _id: req.params.userId });
//         if (!userToUpdate) throw nonExistenceError("user");

//         const validPass = await bcrypt.compare(
//             req.body.password,
//             userToUpdate.password,
//         );
//         if (!validPass) throw wrongPwError;

//         // update only supplied fields
//         let updateQuery = { $set: {} };

//         if (req.files?.avatar) {
//             updateQuery.$set["avatarImage"] = {
//                 name: req.files.avatar[0].filename,
//                 mimeType: req.files.avatar[0].mimetype,
//                 location: req.files.avatar[0].path,
//             };
//         }

//         if (req.files?.cover) {
//             updateQuery.$set["coverImage"] = {
//                 name: req.files.cover[0].filename,
//                 mimeType: req.files.cover[0].mimetype,
//                 location: req.files.cover[0].path,
//             };
//         }

//         for (let key in req.body) {
//             if (key != "password") {
//                 if (userToUpdate[key] === null)
//                     updateQuery.$set[key] = req.body[key];
//                 else if (
//                     userToUpdate[key] &&
//                     userToUpdate[key] !== req.body[key]
//                 )
//                     updateQuery.$set[key] = req.body[key];
//             }
//         }

//         // ? UPDATE USER
//         await User.updateOne(
//             { _id: userToUpdate._id },
//             updateQuery, //using $set method here to update values
//         );

//         await profileAvatarCoverDelete(
//             userToUpdate.avatarImage,
//             userToUpdate.coverImage,
//         );

//         return res.status(200).send({
//             Success: {
//                 status: 200,
//                 message: "Profile successfully updated",
//                 userId: userToUpdate._id,
//             },
//         });
//     } catch (error: Error | any) {
//         if (env.NODE_ENV === "dev") console.error(error);
//         return res.status(400).render("error", { error, res, req });
//     }
// };
