import express, { Request, Response } from "express";
import expressLayout from "express-ejs-layouts";
import flash from "express-flash-message";
import session from "express-session";
import morgan from "morgan";

import { env } from "./env";
import { connectDB } from "./server/config/db";
import { TUser } from "./server/models/User.models";
import authRouter from "./server/routes/auth.routes";
import itemRouter from "./server/routes/item.routes";
import meRouter from "./server/routes/me.routes";
import basicRouter from "./server/routes/routes";
import userRouter from "./server/routes/user.routes";

// const bodyParser from "body-parser");
// const cookieParser from "cookie-parser");

const app = express();
const port = 5000;

// Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// Static Files
app.use(express.static("public"));

// Express Session
app.use(
    session({
        secret: env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // day
            secure: false,
            httpOnly: true,
        },
    }),
);

declare module "express-session" {
    interface SessionData {
        user?: TUser | null;
    }
}

// Flash Messages
app.use(
    flash({
        sessionKeyName: "flashMessage",
        onAddFlash: (type, message) => {},
        onConsumeFlash: (type: string, messages: string[]) => {},
    }),
);

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("", basicRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/me", meRouter);
app.use("/public", express.static("public"));

// Handle 404
app.get("*", (req: Request, res: Response) => {
    return res.status(404).render("404", { req, res });
});

app.listen(port, () => {
    console.log(`App listeing on port ${port}`);
});
