import { CustomLocals } from "@/types/reqResNext";
import { Customer } from "../models/Customer";

import type { Request, Response } from "express";

/**
 * GET /
 * Homepage
 */
export const admin = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
    } as CustomLocals;

    let perPage = 12;
    let page = Number(req.query.page) || 1;

    try {
        const customers = await Customer.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();

        return res.render("admin", {
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

/**
 * GET /
 * About
 */
export const about = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
    };

    try {
        return res.render("about", { req, res });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const signUpIn = async (req: Request, res: Response) => {
    try {
        res.locals = {
            ...res.locals,
            title: "Lost and Found",
            description: "Lost and Found Management System",
        };

        return res.render("signUpIn", { req, res });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const home = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
    };

    try {
        if (req.session.user) {
            return res.redirect("/item/lost");
        } else {
            return res.render("landing", { req, res });
        }
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const lostAndFound = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    try {
        return res.render("lostAndFound", { req, res });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};
