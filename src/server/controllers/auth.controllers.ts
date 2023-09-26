import bcrypt from "bcrypt";

import {
    confirmEmailSender,
    deleteAccountEmailSender,
    emailVerifiedEmailSender,
    resetPasswordEmailSender,
} from "../middlewares/emailSender";
import {
    deleteAccountValidation,
    emailValidation,
    loginValidation,
    registerValidation,
    resendConfEmailValidation,
} from "../middlewares/validation";
import { Token } from "../models/Token.models";
import { User } from "../models/User.models";
import { errorMessage, nonExistenceError } from "../utils/errorMessages";

import type { Request, Response } from "express";

////////////            ! REGISTRATION           ////////////

/** Controls REGISTER POST requests.
 * POST body: { username: , email: , password: }
 * */
export const register_post = async (req: Request, res: Response) => {
    try {
        // First validate req.body data
        const { error } = registerValidation(req.body);
        if (error)
            throw {
                message: error.details[0].message,
            };

        // Check unique email
        const userEmailFound = await User.findOne({ email: req.body.email });
        if (userEmailFound)
            throw {
                type: "already exists",
                message: `Email: '${req.body.email}' is already associated with another account.`,
            };

        // check unique username
        const usernameFound = await User.findOne({
            username: req.body.username,
        });
        if (usernameFound)
            throw {
                type: "already exists",
                message: `Username: '${req.body.username}' is already taken.`,
            };

        // Password hasing using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // User creation in database (create a new user using the credentials provided and hashed and our schema)
        const savedUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // token generator
        const tokenKey =
            Math.random().toString(36).substring(2, 10) +
            Math.random().toString(36).substring(2, 10);

        const savedToken = await Token.create({
            userId: savedUser.id,
            token: tokenKey,
            usage: "Email confirmation",
        });
        // console.log("\nsavedToken:" + savedToken);

        // send email
        const messageResponse = await confirmEmailSender(
            req,
            savedUser,
            savedToken,
        );
        if (messageResponse) throw messageResponse;

        res.flash(
            "auth",
            "Successfully registered! Please check your email to verify your account.",
        );

        return res.render("auth/registered", { req, res });
    } catch (error: Error | any) {
        console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

////////////            ! LOGIN                   ////////////

/** Controls LOGIN POST request.
 *
 * POST body: { email: , password: }
 */
export const login_post = async (req: Request, res: Response) => {
    try {
        //Validate login req.body data
        const { error } = loginValidation(req.body);
        if (error)
            throw {
                message: error.details[0].message,
            };

        //check email exists
        const userFound = await User.findOne({ email: req.body.email });
        if (!userFound)
            throw {
                type: "Non-existence",
                message: "Email not found!",
                location: "email",
            };

        // check email verified
        if (!userFound.isEmailVerified)
            throw {
                type: "Access denied",
                message: "Email is not verified! Please verify.",
                location: "email",
            };

        // Check password
        const validPass = await bcrypt.compare(
            req.body.password,
            userFound.password,
        );
        if (!validPass)
            throw {
                type: "Authentication failure",
                message: "Wrong Password.",
                location: "password",
            };

        req.session.user = userFound;

        res.locals.loggedIn = true;
        res.flash("auth", "Successfully logged in!");

        return res.redirect("/me/dashboard");
    } catch (error: Error | any) {
        console.error(error);
        res.flash("error", error.message);
        return res.render("error", { error, req, res });
    }
};

export const logout_get = async (req: Request, res: Response) => {
    try {
        res.flash("auth", "Successfully logged out!");
        res.locals.loggedIn = false;

        req.session.user = null;
        req.session.save(function (err) {
            if (err) throw err;
            req.session.regenerate(function (err) {
                if (err) throw err;
            });
        });

        return res.redirect("/");
    } catch (error: Error | any) {
        console.error(error);
        res.flash("error", error.message);
        return res.status(400).render("error", { error, res, req });
    }
};

////////////            ! CONFIRMATION           ////////////

/** Confirmation handler GET */
export const email_confirmation_handler_get = async (
    req: Request,
    res: Response,
) => {
    try {
        const urlToken = req.params.token; //retrieve token from url
        const tokenFound = await Token.findOne({ token: urlToken });
        if (!tokenFound)
            throw {
                type: "Token Expired",
                message:
                    "Unable to find a valid token or Token already expired",
            };

        // check if the user exists
        const userToVerifyEmail = await User.findOne({
            _id: tokenFound.userId,
        });
        if (!userToVerifyEmail)
            throw {
                type: "Non-existence",
                message: "The user associated to token does not exist.",
            };

        // check user associated with token for if it is already verified
        if (userToVerifyEmail.isEmailVerified)
            throw {
                type: "Already Verified",
                message: "The associated user has already been verified",
            };

        // Verify the user
        await User.updateOne(
            { _id: userToVerifyEmail._id },
            { $set: { isEmailVerified: true } },
        );

        const mailResponse = await emailVerifiedEmailSender(userToVerifyEmail);
        if (mailResponse) throw mailResponse;

        const successMessage = {
            status: 200,
            type: "Successful Request!",
            message: `Email ${userToVerifyEmail.email} verified! Now, You can login.`,
        };

        return res.render("auth/verified", { successMessage, req, res });
    } catch (error: Error | any) {
        console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

/** Sends the email confirmation email again
 *
 * POST body: { email: , password: }
 */
export const resend_email_confirmation_post = async (
    req: Request,
    res: Response,
) => {
    // First validate req.body data
    try {
        const { error } = resendConfEmailValidation(req.body);
        if (error) throw error;

        // Check if user with that email exists
        const userFound = await User.findOne({ email: req.body.email });
        if (!userFound)
            throw {
                type: "Non-existence",
                message: `Email: '${req.body.email}' is not associated with any accounts.`,
            };

        // token generator
        const tokenKey =
            Math.random().toString(36).substring(2, 10) +
            Math.random().toString(36).substring(2, 10);

        // token save to database
        const token = new Token({
            userId: userFound.id,
            token: tokenKey,
            usage: "Email confirmation",
        });

        const newToken = await new Token(token).save();

        // send email
        const mailResponse = await confirmEmailSender(req, userFound, newToken);
        if (mailResponse) throw mailResponse;

        return res.status(200).send({
            success: {
                status: 200,
                type: "Request successful",
                message: "Email confirmation resent",
            },
        });
    } catch (error: Error | any) {
        console.error(error);
        return res.status(400).json({ ...error, status: "error" });
    }
};

// ////////////            ! RESET PASSWORD         ////////////

// /** Sends email for password reset
//  *
//  * POST body: { email: }
//  */
// export const reset_password_email_post = async (
//     req: Request,
//     res: Response,
// ) => {
//     // First validate req.body data
//     try {
//         const { error } = emailValidation(req.body);

//         if (error) throw error;
//         // Check if user with that email exists
//         const userFound = await User.findOne({ email: req.body.email });

//         if (!userFound)
//             throw {
//                 type: "Non-existence",
//                 message: `Email: '${req.body.email}' is not associated with any accounts.`,
//             };
//         // token generator
//         const tokenKey =
//             Math.random().toString(36).substring(2, 10) +
//             Math.random().toString(36).substring(2, 10);
//         // token save to database
//         const token = new Token({
//             userId: userFound.id,
//             token: tokenKey,
//             usage: "Password reset",
//         });
//         const newToken = await token.save();
//         // send email
//         const mailResponse = await resetPasswordEmailSender(
//             req,
//             userFound,
//             newToken,
//         );
//         if (mailResponse) throw mailResponse;

//         // after everything done successfully
//         return res.status(200).send({
//             success: {
//                 status: 200,
//                 type: "Request successful",
//                 message: "Reset Email Password confirmation resent",
//             },
//         });
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).render("error", { error, res, req });
//     }
// };

// /** GET request for token verification for password reset
//  *
//  * @returns Token, User
//  */
// export const reset_password_get = async (req: Request, res: Response) => {
//     try {
//         const urlToken = req.params.token;

//         const tokenFound = await Token.findOne({ token: urlToken });
//         if (!tokenFound) {
//             throw nonExistenceError("token");
//         }

//         // check user associated with found token
//         const userFound = await User.findOne({ _id: tokenFound.userId });
//         if (!userFound) {
//             throw nonExistenceError("user");
//         }

//         return res.status(200).send({
//             success: {
//                 token: tokenFound._id,
//                 user: userFound._id,
//             },
//         });

//         // Note: in the front end you can determine whether to display form
//         // for password reset or not depending on the response. if you get a
//         // token display the form, if not display error
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).render("error", { error, res, req });
//     }
// };

// /** Reset password handler
//  *
//  * PATCH body: { userId: , token: , new_password: }
//  */
// export const reset_password_handler_patch = async (
//     req: Request,
//     res: Response,
// ) => {
//     // return res.send("in progress");
//     try {
//         const userToResetPasswordOf = await User.findOne({
//             email: req.body.email,
//         });
//         if (!userToResetPasswordOf) throw nonExistenceError("user");

//         const tokenFound = await Token.findOne({ token: req.body.token });
//         if (!tokenFound)
//             throw errorMessage(
//                 404,
//                 "Bad Request!",
//                 "Unable to find a valid token or Token already expired",
//             );

//         // NOTE: implement check ifEmailVerified or not?

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         await User.updateOne(
//             {
//                 _id: userToResetPasswordOf._id,
//             },
//             {
//                 $set: {
//                     password: hashedPassword,
//                 },
//             },
//         );

//         return res.status(200).json({
//             success: {
//                 type: "Request successful",
//                 message: `Password successfully reset for ${userToResetPasswordOf.email}`,
//             },
//         });
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).json({ ...error, status: "error" });
//     }
// };

// ////////////            ! ACCOUNT DELETE         ////////////

// /** Sends email for account delete
//  *
//  * POST body: { email: , password: }
//  */
// export const delete_account_email_post = async (
//     req: Request,
//     res: Response,
// ) => {
//     try {
//         const { error } = deleteAccountValidation(req.body);
//         if (error) throw error;

//         const userFound = await User.findOne({ email: req.body.email });

//         if (!userFound)
//             throw {
//                 type: "Non-existence",
//                 message: `Email: '${req.body.email}' is not associated with any accounts.`,
//             };

//         const validPass = await bcrypt.compare(
//             req.body.password,
//             userFound.password,
//         );

//         if (!validPass)
//             throw {
//                 type: "Authentication failure",
//                 message: "Wrong Password.",
//             };

//         const tokenKey =
//             Math.random().toString(36).substring(2, 10) +
//             Math.random().toString(36).substring(2, 10);

//         const newToken = await new Token({
//             userId: userFound.id,
//             token: tokenKey,
//             usage: "Account Deletion",
//         }).save();

//         const mailResponse = await deleteAccountEmailSender(
//             req,
//             userFound,
//             newToken,
//         );
//         if (mailResponse) throw mailResponse;

//         return res.status(200).send({
//             success: {
//                 status: 200,
//                 type: "Request successful!",
//                 message: "Delete Account email confirmation sent",
//             },
//         });
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).render("error", { error, res, req });
//     }
// };

// /** GET request for token verification for account deletion
//  *
//  * @returns Token, User object
//  */
// export const delete_account_get = async (req: Request, res: Response) => {
//     try {
//         const urlToken = req.params.token;
//         const tokenFound = await Token.findOne({ token: urlToken });
//         if (!tokenFound) {
//             throw {
//                 type: "Non-existence",
//                 message:
//                     "Unable to find a valid token or Token already expired",
//             };
//         }

//         const userFound = await User.findOne({ _id: tokenFound.userId });
//         if (!userFound) {
//             throw {
//                 type: "Non-existence",
//                 message: "Unable to find a user associated with token",
//             };
//         }

//         return res.status(200).send({
//             success: {
//                 token: tokenFound._id,
//                 user: userFound._id,
//             },
//         });

//         // Note: in the front end you can determine whether to display form
//         // for password reset or not depending on the response. if you get a
//         // token display the form, if not display error
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).render("error", { error, res, req });
//     }
// };

// /** Controller for account deletion
//  *
//  * DELETE body: { email: , token: , password: }
//  */
// export const delete_account_handler_delete = async (
//     req: Request,
//     res: Response,
// ) => {
//     // return res.send("in progress");
//     try {
//         const tokenFound = await Token.findOne({ token: req.body.token });
//         if (!tokenFound) {
//             throw {
//                 status_code: 404,
//                 type: "Non-existence",
//                 message:
//                     "Unable to find a valid token or Token already expired",
//             };
//         }

//         const userToDelete = await User.findOne({ email: req.body.email });
//         if (!userToDelete) {
//             throw {
//                 type: "Non-existence",
//                 message: "Unable to find a user associated with token",
//             };
//         }

//         const validPass = await bcrypt.compare(
//             req.body.password,
//             userToDelete.password,
//         );
//         if (!validPass)
//             throw {
//                 type: "Authentication failure",
//                 message: "Wrong Password.",
//             };

//         await User.deleteOne({ _id: userToDelete._id });

//         //? implement check ifEmailVerified or not?

//         return res.status(200).json({
//             success: {
//                 type: "Request successful",
//                 message: `Account successfully deleted`,
//             },
//         });
//     } catch (error: Error | any) {
//         console.error(error);
//         return res.status(400).json({ ...error, status: "error" });
//     }
// };
