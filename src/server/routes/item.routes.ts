import express from "express";

import * as itemController from "../controllers/item.controllers";
import { imagesUpload } from "../middlewares/fileUpload";
import { adminVerify, loggedInVerify } from "../middlewares/verification";

const itemRouter = express.Router();

itemRouter.get("/lost/list", loggedInVerify, itemController.lostItems);
itemRouter.get("/lost/:id", loggedInVerify, itemController.lostItemDetail);
itemRouter.post(
    "/lost/add",
    loggedInVerify,
    imagesUpload,
    itemController.postLostItem,
);

itemRouter.get("/found/list", loggedInVerify, itemController.foundItems);
itemRouter.get("/found/:id", loggedInVerify, itemController.foundItemDetail);
itemRouter.post(
    "/found/add",
    loggedInVerify,
    imagesUpload,
    itemController.postFoundItem,
);

itemRouter.get(
    "/lost-and-found",
    loggedInVerify,
    itemController.reportLostAndFoundPage,
);

itemRouter.get("/match/list", loggedInVerify, itemController.matchedItems);
itemRouter.get("/match/add", loggedInVerify, itemController.matchItemsPage);
itemRouter.post(
    "/match/add",
    loggedInVerify,
    adminVerify,
    itemController.postMatchLostAndFound,
);

export default itemRouter;
