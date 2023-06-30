const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

/**
 *  Customer Routes 
*/
router.get('/', itemController.homepage);
// router.get('/about', customerController.about);
router.post('/add', itemController.postItem);
// router.post('/add', customerController.postCustomer);
// router.get('/view/:id', customerController.view);
// router.get('/edit/:id', customerController.edit);
// router.put('/edit/:id', customerController.editPost);
// router.delete('/edit/:id', customerController.deleteCustomer);

// router.post('/search', customerController.searchCustomers);
// router.get('/signinout', customerController.signinout);
// router.get('/home', customerController.home);
// router.get('/lostandfound', customerController.lostandfound);



module.exports = router;