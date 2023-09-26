import express from "express";

import * as itemController from "../controllers/item.controllers";
import { imagesUpload } from "../middlewares/fileUpload";
import { loggedInVerify } from "../middlewares/verification";

const itemRouter = express.Router();

itemRouter.get("/lost", itemController.lostItems);
itemRouter.get("/found", itemController.foundItems);
itemRouter.get("/match", itemController.matchItemsPage);
itemRouter.get(
    "/lost-and-found",
    loggedInVerify,
    itemController.reportLostAndFoundPage,
);

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
itemRouter.post(
    "/match-lost-found",
    loggedInVerify,
    itemController.postMatchLostAndFound,
);

export default itemRouter;
