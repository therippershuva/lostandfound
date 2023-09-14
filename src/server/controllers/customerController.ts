import { Customer } from "../models/Customer";

import type { Request, Response } from "express";

/**
 * GET /
 * New Customer Form
 */
export const addCustomer = async (req: Request, res: Response) => {
    res.locals = {
        ...res.locals,
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    return res.render("customer/add", { req, res });
};

/**
 * POST /
 * Create New Customer
 */
export const postCustomer = async (req: Request, res: Response) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email,
    });

    try {
        await Customer.create(newCustomer);
        res.flash("info", "New customer has been added.");

        return res.redirect("/");
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * Customer Data
 */
export const view = async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id });

        const locals = {
            title: "home",
            description: "Free NodeJs User Management System",
        };

        return res.render("customer/view", {
            locals,
            customer,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * Edit Customer Data
 */
export const edit = async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id });

        const locals = {
            title: "home",
            description: "Free NodeJs User Management System",
        };

        return res.render("customer/edit", {
            locals,
            customer,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * GET /
 * Update Customer Data
 */
export const editPost = async (req: Request, res: Response) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now(),
        });
        console.log("redirected");
        return res.redirect(`/edit/${req.params.id}`);
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * Delete /
 * Delete Customer Data
 */
export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        await Customer.deleteOne({ _id: req.params.id });
        return res.redirect("/");
    } catch (error: Error | any) {
        console.log(error);
    }
};

/**
 * Get /
 * Search Customer Data
 */
export const searchCustomers = async (req: Request, res: Response) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        session: req.session,
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ],
        });

        return res.render("search", {
            customers,
            locals,
            req,
            res,
        });
    } catch (error: Error | any) {
        console.log(error);
    }
};
