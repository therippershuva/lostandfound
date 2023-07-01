const Customer = require("../models/Customer");
const Item = require("../models/Item");

exports.postItem = async (req, res) => {
    console.log(req.body);

    const newItem = new Item({
        description: req.body.description,
        lastLocation: req.body.lastLocation,
        images: "this is image",
    });

    try {
        await Item.create(newItem);
        await req.flash("info", "New item has been added.");

        res.redirect("/item");
    } catch (error) {
        console.log(error);
    }
};

exports.homepage = async (req, res) => {
    const messages = await req.consumeFlash("info");
    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System",
    };

    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const items = await Item.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Item.count();

        res.render("inventory", {
            locals,
            items,
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
        });
    } catch (error) {
        console.log(error);
    }
};
