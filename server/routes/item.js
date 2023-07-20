const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const {
    checkSessionToken,
    loggedInVerify,
} = require("../middlewares/verification");
const { imagesUpload } = require("../middlewares/fileUpload");

/**
 *  Customer Routes
 */
router.get("/lost", checkSessionToken, itemController.lostItems);
router.get("/found", checkSessionToken, itemController.foundItems);
// router.get('/about', customerController.about);
router.post(
    "/report-lost",
    checkSessionToken,
    loggedInVerify,
    imagesUpload,
    itemController.postLostItem
);
router.post(
    "/report-found",
    checkSessionToken,
    loggedInVerify,
    imagesUpload,
    itemController.postFoundItem
);
// router.post('/add', customerController.postCustomer);
// router.get('/view/:id', customerController.view);
// router.get('/edit/:id', customerController.edit);
// router.put('/edit/:id', customerController.editPost);
// router.delete('/edit/:id', customerController.deleteCustomer);

// router.post('/search', customerController.searchCustomers);
// router.get('/signUpIn', customerController.signUpIn);
// router.get('/home', customerController.home);
// router.get('/lostandfound', customerController.lostandfound);

module.exports = router;
