import express from "express";
import * as itemController from "../controllers/itemController";
import { imagesUpload } from "../middlewares/fileUpload";
import { checkSessionToken, loggedInVerify } from "../middlewares/verification";

const itemRouter = express.Router();

itemRouter.get("/lost", itemController.lostItems);
itemRouter.get("/found", itemController.foundItems);
itemRouter.post(
    "/report-lost",
    loggedInVerify,
    imagesUpload,
    itemController.postLostItem,
);
itemRouter.post(
    "/report-found",
    loggedInVerify,
    imagesUpload,
    itemController.postFoundItem,
);

export default itemRouter;
