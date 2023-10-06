import { CustomLocals } from "@/types/reqResNext";

import { FoundItem, LostItem, MatchItem } from "../models/Item.models";
import { User } from "../models/User.models";

import type { Request, Response } from "express";

export const admin = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
    } as CustomLocals;

    let perPage = 12;
    let page = Number(req.query.page) || 1;

    try {
        const users = await User.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const usersCount = users.length;
        const lostItemsCount = await LostItem.count();
        const foundItemsCount = await FoundItem.count();
        const matchedItemsCount = await MatchItem.count();

        return res.render("admin", {
            users,
            usersCount,
            lostItemsCount,
            foundItemsCount,
            matchedItemsCount,
            current: page,
            pages: Math.ceil(usersCount / perPage),
            req,
            res,
        });
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
            return res.redirect("/me/dashboard");
        } else {
            return res.render("landing", { req, res });
        }
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

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
