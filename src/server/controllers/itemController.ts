import { FoundItem, LostItem } from "../models/Item";

import type { Request, Response } from "express";

export const postLostItem = async (req: Request, res: Response) => {
    try {
        const filesArray = req.files as Express.Multer.File[];
        const filesDictionary = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        let images: string[] = [];
        if (filesArray) {
            for (let item of filesArray) {
                images.push(item.path);
            }
        }

        if (filesDictionary) {
            for (let item in filesDictionary) {
                let files = filesDictionary[item];
                for (let file of files) {
                    images.push(file.path);
                }
            }
        }

        const newItem = new LostItem({
            description: req.body.description,
            lastLocation: req.body.lastLocation,
            images: images,
            name: req.body.name,
            category: req.body.category,
            lastSeenDate: req.body.lastSeenDate,
        });

        await LostItem.create(newItem);
        res.flash("info", "New item has been added.");

        return res.redirect("/item/lost");
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const postFoundItem = async (req: Request, res: Response) => {
    const filesArray = req.files as Express.Multer.File[];
    const filesDictionary = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };

    let images: string[] = [];

    if (filesArray) {
        for (let item of filesArray) {
            images.push(item.path);
        }
    }

    if (filesDictionary) {
        for (let item in filesDictionary) {
            let files = filesDictionary[item];
            for (let file of files) {
                images.push(file.path);
            }
        }
    }

    const newItem = new FoundItem({
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

        res.redirect("/item/lost");
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};

export const lostItems = async (req: Request, res: Response) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
    };

    let perPage = 12;
    let lostPage = Number(req.query.lostPage) || 1;

    try {
        const lostItems = await LostItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * lostPage - perPage)
            .limit(perPage)
            .exec();
        const lostCount = await LostItem.count();

        return res.render("lostItems", {
            locals,
            lostItems,
            lostCurrent: lostPage,
            lostPages: Math.ceil(lostCount / perPage),
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
        loggedIn: !!req.session.cookie,
    };

    let perPage = 12;
    let foundPage = Number(req.query.foundPage) || 1;

    try {
        const foundItems = await FoundItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * foundPage - perPage)
            .limit(perPage)
            .exec();
        const foundCount = await FoundItem.count();

        return res.render("foundItems", {
            locals,
            foundItems,
            foundCurrent: foundPage,
            foundPages: Math.ceil(foundCount / perPage),
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
        res.flash("error", error.message);
        return res.status(500).render("error", { error });
    }
};
