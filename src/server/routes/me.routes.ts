import express from "express";

import * as meController from "../controllers/me.controllers";
import { loggedInVerify } from "../middlewares/verification";

const meRouter = express.Router();

meRouter.get("/dashboard", loggedInVerify, meController.dashboard);

export default meRouter;
