const Customer = require("../models/Customer");
const mongoose = require("mongoose");

/**
 * GET /
 * Homepage
 */
exports.admin = async (req, res) => {
    const messages = await req.consumeFlash("info");
    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System",
    };

    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();

        res.render("admin", {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
    const locals = {
        title: "About",
        description: "Free NodeJs User Management System",
    };

    try {
        res.render("about", locals);
    } catch (error) {
        console.log(error);
    }
};

exports.signinout = async (req, res) => {
    const locals = {
        title: "signinout",
        description: "Free NodeJs User Management System",
    };

    try {
        res.render("signinout", locals);
    } catch (error) {
        console.log(error);
    }
};

exports.home = async (req, res) => {
    const locals = {
        title: "home",
        description: "Free NodeJs User Management System",
    };

    try {
        res.render("home", locals);
    } catch (error) {
        console.log(error);
    }
};

exports.lostandfound = async (req, res) => {
    const locals = {
        title: "lostandfound",
        description: "Free NodeJs User Management System",
    };

    try {
        res.render("lostandfound", locals);
    } catch (error) {
        console.log(error);
    }
};
