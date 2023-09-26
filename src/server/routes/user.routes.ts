import express from "express";

import * as userController from "../controllers/user.controllers";
import { adminVerify, loggedInVerify } from "../middlewares/verification";

const userRouter = express.Router();

userRouter.get("/add", adminVerify, userController.addUser);
userRouter.post("/add", adminVerify, userController.postUser);
userRouter.get("/view/:id", loggedInVerify, userController.view);
userRouter.get("/edit/:id", adminVerify, userController.edit);
userRouter.put("/edit/:id", adminVerify, userController.editUser);
userRouter.delete("/edit/:id", adminVerify, userController.deleteUser);
userRouter.post("/search", adminVerify, userController.searchUsers);

export default userRouter;
