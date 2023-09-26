import { Types } from "mongoose";
import { FoundItem, LostItem } from "../models/Item.models";

import type { Request, Response } from "express";

export const dashboard = async (req: Request, res: Response) => {
    const reqUser = req.session.user;
    if (!reqUser) {
        throw new Error("You must be logged in to view this page.");
    }
    let perPage = 12;
    let lostCurrent = Number(req.query.lostPage) || 1;
    let foundCurrent = Number(req.query.lostPage) || 1;

    try {
        // LOST
        const lostItems = await LostItem.aggregate([
            { $match: { createdBy: new Types.ObjectId(reqUser._id) } },
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * lostCurrent - perPage)
            .limit(perPage)
            .exec();
        const myCountLost = lostItems.length;

        // FOUND
        const foundItems = await FoundItem.aggregate([
            { $match: { createdBy: new Types.ObjectId(reqUser._id) } },
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * foundCurrent - perPage)
            .limit(perPage)
            .exec();
        const myCountFound = foundItems.length;

        return res.render("me/dashboard", {
            //    found
            foundItems,
            foundCurrent,
            foundPages: Math.ceil(myCountFound / perPage),
            // lost
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
