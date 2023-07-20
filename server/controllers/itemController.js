const { LostItem, FoundItem } = require("../models/Item");

exports.postLostItem = async (req, res) => {
    try {
        let images = [];
        if (req.files) {
            for (item in req.files) images.push(item.path);
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
        await req.flash("info", "New item has been added.");

        res.redirect("/item/lost");
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.postFoundItem = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    let images = [];
    if (req.files) {
        for (item in req.files) images.push(item.path);
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
        await req.flash("info", "New item has been added.");

        res.redirect("/item/lost");
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.lostItems = async (req, res) => {
    const messages = await req.consumeFlash("info");
    const authMessages = await req.consumeFlash("auth");
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
    };

    let perPage = 12;
    let lostPage = req.query.lostPage || 1;

    try {
        const lostItems = await LostItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * lostPage - perPage)
            .limit(perPage)
            .exec();
        const lostCount = await LostItem.count();

        res.render("lostItems", {
            locals,
            lostItems,
            lostCurrent: lostPage,
            lostPages: Math.ceil(lostCount / perPage),
            messages,
            authMessages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};

exports.foundItems = async (req, res) => {
    const messages = await req.consumeFlash("info");
    const authMessages = await req.consumeFlash("auth");
    const locals = {
        title: "Lost and Found",
        description: "Lost and Found Management System",
        loggedIn: req.session.loggedIn,
    };

    let perPage = 12;
    let foundPage = req.query.foundPage || 1;

    try {
        const foundItems = await FoundItem.aggregate([
            { $sort: { createdAt: -1 } },
        ])
            .skip(perPage * foundPage - perPage)
            .limit(perPage)
            .exec();
        const foundCount = await FoundItem.count();

        res.render("foundItems", {
            locals,
            foundItems,
            foundCurrent: foundPage,
            foundPages: Math.ceil(foundCount / perPage),
            messages,
            authMessages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { error });
    }
};
