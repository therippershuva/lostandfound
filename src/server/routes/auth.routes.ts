import { Router } from "express";

import * as authController from "../controllers/auth.controllers";
import { loggedInVerify } from "../middlewares/verification";

const authRouter = Router();

authRouter.post("/register", authController.register_post);
authRouter.get(
    "/confirmation/:token",
    authController.email_confirmation_handler_get,
);
authRouter.post(
    "/resend_confirmation",
    authController.resend_email_confirmation_post,
);

authRouter.post("/login", authController.login_post);
authRouter.get("/logout", loggedInVerify, authController.logout_get);

// authRouter.post("/reset_password", authController.reset_password_email_post);
// authRouter.get("/reset_password/:token", authController.reset_password_get);
// authRouter.patch(
//     "/reset_password/confirm/",
//     authController.reset_password_handler_patch,
// );

export default authRouter;
