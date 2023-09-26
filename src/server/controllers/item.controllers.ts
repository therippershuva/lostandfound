import { FoundItem, LostItem } from "../models/Item.models";

import type { Request, Response } from "express";

/////////////////////////////////
// CREATE
/////////////////////////////////

export const postLostItem = async (req: Request, res: Response) => {
    try {
        const reqUser = req.session?.user;
        if (!reqUser) throw new Error("Please Login to continue.");

        const filesDictionary = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        let images: string[] = [];

        if (filesDictionary) {
            for (let item in filesDictionary) {
                let files = filesDictionary[item];
                for (let file of files) {
                    images.push(file.path);
                }
            }
        }

        const newItem = new LostItem({
            createdBy: reqUser._id,
            description: req.body.description,
            lostLocation: req.body.lostLocation,
            images: images,
            name: req.body.name,
            category: req.body.category,
            lostDate: req.body.lostDate,
        });

        await LostItem.create(newItem);
        res.flash("info", "New item has been added.");

        return res.redirect("/me/dashboard");
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error, req, res });
    }
};

export const postFoundItem = async (req: Request, res: Response) => {
    const reqUser = req.session?.user;
    if (!reqUser) throw new Error("Please Login to continue.");

    const filesDictionary = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };

    let images: string[] = [];
    if (filesDictionary) {
        for (let item in filesDictionary) {
            let files = filesDictionary[item];
            for (let file of files) {
                images.push(file.path);
            }
        }
    }

    const newItem = new FoundItem({
        createdBy: reqUser._id,
        description: req.body.description,
        foundLocation: req.body.foundLocation,
        images: images,
        name: req.body.name,
        category: req.body.category,
        foundDate: req.body.foundDate,
    });

    try {
        await FoundItem.create(newItem);
        await res.flash("info", "New item has been added.");

        res.redirect("/me/dashboard");
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error, req, res });
    }
};

export const postMatchLostAndFound = async (req: Request, res: Response) => {
    try {
        const reqUser = req.session?.user;
        if (!reqUser) throw new Error("Please Login to continue.");

        return res.redirect("/me/dashboard");
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error, req, res });
    }
};

/////////////////////////////////
// READ
/////////////////////////////////

export const lostItems = async (req: Request, res: Response) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
    };

    let perPage = 12;
    let lostCurrent = Number(req.query.lostPage) || 1;

    try {
        const lostItems = await LostItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * lostCurrent - perPage)
            .limit(perPage)
            .exec();
        const myCountLost = await LostItem.count();

        return res.render("item/lostItems", {
            locals,
            lostItems,
            lostCurrent,
            lostPages: Math.ceil(myCountLost / perPage),
            // req info
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const foundItems = async (req: Request, res: Response) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
    };

    let perPage = 12;
    let foundCurrent = Number(req.query.foundPage) || 1;

    try {
        const foundItems = await FoundItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * foundCurrent - perPage)
            .limit(perPage)
            .exec();
        const myCountFound = await FoundItem.count();

        return res.render("item/foundItems", {
            locals,
            foundItems,
            foundCurrent,
            foundPages: Math.ceil(myCountFound / perPage),
            // req info
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const matchItemsPage = async (req: Request, res: Response) => {
    try {
        const lostItems = await LostItem.find();
        const foundItems = await FoundItem.find();

        return res.render("item/matchLostAndFound", {
            lostItems,
            foundItems,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const reportLostAndFoundPage = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    try {
        return res.render("item/reportLostOrFound", { req, res });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};
