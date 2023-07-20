require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const { flash } = require("express-flash-message");
const session = require("express-session");
const connectDB = require("./server/config/db");
const { checkSessionToken } = require("./server/middlewares/verification");

// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Static Files
app.use(express.static("public"));

// Express Session
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // day
        },
    })
);

// Flash Messages
app.use(flash({ sessionKeyName: "flashMessage" }));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/routes"));
app.use("/item", require("./server/routes/item"));
app.use("/customer", require("./server/routes/customer"));
app.use("/auth", require("./server/routes/authRoutes"));

// Handle 404
app.get("*", checkSessionToken, (req, res) => {
    const locals = {
        loggedIn: req.session.loggedIn,
        session: req.session,
    };
    res.status(404).render("404", locals);
});

app.listen(port, () => {
    console.log(`App listeing on port ${port}`);
});
