import express from "express";

import * as basicController from "../controllers/basic.controllers";
import { checkSessionToken, loggedInVerify } from "../middlewares/verification";

const basicRouter = express.Router();

basicRouter.get("/", basicController.home);
basicRouter.get("/admin", checkSessionToken, basicController.admin);
basicRouter.get("/about", basicController.about);
basicRouter.get("/sign-up-in", basicController.signUpIn);

export default basicRouter;
