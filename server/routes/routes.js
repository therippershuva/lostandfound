const express = require("express");
const router = express.Router();
const basicController = require("../controllers/basicControllers");

router.get("/", basicController.home);
router.get("/admin", basicController.admin);
router.get("/about", basicController.about);
router.get("/sign-in-out", basicController.signinout);
router.get("/lost-and-found", basicController.lostandfound);

module.exports = router;
