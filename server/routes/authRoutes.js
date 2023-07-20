/**
 * User Authentication routes
 *
 * contailns all routes extended by the authRouter
 * root url: `{host_url}/api/auth`
 */

const { checkSessionToken } = require("../middlewares/verification");

/** @desc auth router
 * @use routes to api/auth */
const authRouter = require("express").Router();

// controllers
const authController = require("../controllers/authControllers");

authRouter.get("/", authController.auth_get);

authRouter
    .route("/register", checkSessionToken)
    .get(authController.register_get)
    .post(authController.register_post);

authRouter.get("/confirmation/:token", authController.email_confirmation_handler_get);
authRouter.post(
    "/resend_confirmation",
    checkSessionToken,
    authController.resend_email_confirmation_post
);

authRouter
    .route("/login", checkSessionToken)
    .get(authController.login_get)
    .post(authController.login_post);

authRouter.get("/logout", checkSessionToken, authController.logout_get);

// NOTE: Logic: send email, get token from email, following link takes to reset form, then submit reset form
authRouter.post("/reset_password", checkSessionToken, authController.reset_password_email_post);
authRouter.get("/reset_password/:token", checkSessionToken, authController.reset_password_get);
authRouter.patch(
    "/reset_password/confirm/",
    checkSessionToken,
    authController.reset_password_handler_patch
);

authRouter.post("/delete_account", checkSessionToken, authController.delete_account_email_post);
authRouter.get("/delete_account/:token", checkSessionToken, authController.delete_account_get);
authRouter.delete("/delete_account/confirm/", authController.delete_account_handler_delete);
authRouter.delete("/delete_account/confirm/", authController.delete_account_handler_delete);

module.exports = authRouter;
