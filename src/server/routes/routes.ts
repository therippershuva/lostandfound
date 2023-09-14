import express from "express";

import * as basicController from "../controllers/basicControllers";
import { checkSessionToken, loggedInVerify } from "../middlewares/verification";

const basicRouter = express.Router();

basicRouter.get("/", basicController.home);
basicRouter.get("/admin", checkSessionToken, basicController.admin);
basicRouter.get("/about", basicController.about);
basicRouter.get("/sign-up-in", basicController.signUpIn);
basicRouter.get(
    "/lost-and-found",
    loggedInVerify,
    basicController.lostAndFound,
);

export default basicRouter;
