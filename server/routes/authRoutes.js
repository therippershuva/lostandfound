/**
 * User Authentication routes
 *
 * contailns all routes extended by the authRouter
 * root url: `{host_url}/api/auth`
 */

/** @desc auth router
 * @use routes to api/auth */
const authRouter = require("express").Router();

// controllers
const authController = require("../controllers/authControllers");

authRouter.get("/", authController.auth_get);

authRouter.route("/register").get(authController.register_get).post(authController.register_post);

authRouter.get("/confirmation/:token", authController.email_confirmation_handler_get);
authRouter.post(
    "/resend_confirmation",

    authController.resend_email_confirmation_post
);

authRouter.route("/login").get(authController.login_get).post(authController.login_post);

// NOTE: Logic: send email, get token from email, following link takes to reset form, then submit reset form
authRouter.post("/reset_password", authController.reset_password_email_post);
authRouter.get("/reset_password/:token", authController.reset_password_get);
authRouter.patch("/reset_password/confirm/", authController.reset_password_handler_patch);

authRouter.post("/delete_account", authController.delete_account_email_post);
authRouter.get("/delete_account/:token", authController.delete_account_get);
authRouter.delete("/delete_account/confirm/", authController.delete_account_handler_delete);

module.exports = authRouter;
