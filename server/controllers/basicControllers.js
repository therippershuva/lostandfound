const { flash } = require("express-flash-message");
const Customer = require("../models/Customer");
const { errorMessage } = require("../utils/errorMessages");

/**
 * GET /
 * Homepage
 */
exports.admin = async (req, res) => {
    const messages = await req.consumeFlash("info");
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
        session: req.session,
    };

    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([
            { $sort: { createdAt: -1 } },
        ])
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
        res.status(500).render("error", { error });
    }
};

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
        session: req.session,
    };

    try {
        res.render("about", locals);
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.signUpIn = async (req, res) => {
    try {
        const locals = {
            title: "Lost and Found",
            description: "Lost and Found Management System",
            loggedIn: req.session.loggedIn,
            session: req.session,
        };

        res.render("signUpIn", locals);
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.home = async (req, res) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
        session: req.session,
    };

    try {
        res.render("landing", locals);
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.lostAndFound = async (req, res) => {
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
        session: req.session,
    };

    try {
        res.render("lostAndFound", locals);
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};
