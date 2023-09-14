import { env } from "../../env";

import type { NextFunction, Request, Response } from "express";

export const checkSessionToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const sessionUser = req.session.user;

        if (!sessionUser) {
            res.flash("error", "Please login to continue");
            throw new Error("Please login to continue");

            // return res.redirect("/sign-up-in");
        }

        next();
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

export const adminVerify = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const sessionUser = req.session.user;

        if (!sessionUser) {
            res.flash("error", "Please login to continue");
            throw new Error("Please login to continue");
            // return res.redirect("/sign-up-in");
        }

        if (sessionUser && sessionUser.role !== "admin") {
            res.flash("error", "You are not authorized to access this page");
            throw new Error("Please login to continue");
            // return res.redirect("/sign-up-in");
        }

        res.locals.isAdmin = true;

        next();
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

// middleware token check function
export const loggedInVerify = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const sessionUser = req.session.user;

        if (!sessionUser) {
            res.flash("error", "You are not authorized to access this page");
            throw new Error("Please login to continue");
        }

        next();
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).render("error", { error, res, req });
    }
};

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.userId account
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */
export const paramAccountOwnerVerify = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const sessionUser = req.session.user;

        if (!sessionUser) {
            res.flash("error", "Please login to continue");
            throw new Error("Please login to continue");
            // return res.redirect("/sign-up-in");
        }

        if (sessionUser && sessionUser._id !== req.params.userId) {
            res.flash("error", "You are not authorized to access this page");
            throw new Error("Please login to continue");

            // return res.redirect("/sign-up-in");
        }

        next();
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.error(error);
        return res.status(400).send(error);
    }
};
