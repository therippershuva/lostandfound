const express = require("express");
const router = express.Router();
const basicController = require("../controllers/basicControllers");
const {
    checkSessionToken,
    loggedInVerify,
} = require("../middlewares/verification");

router.get("/", checkSessionToken, basicController.home);
router.get("/admin", checkSessionToken, basicController.admin);
router.get("/about", checkSessionToken, basicController.about);
router.get("/sign-up-in", checkSessionToken, basicController.signUpIn);
router.get(
    "/lost-and-found",
    checkSessionToken,
    loggedInVerify,
    basicController.lostAndFound
);

module.exports = router;
