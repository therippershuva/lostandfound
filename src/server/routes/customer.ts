import express from "express";

import * as customerController from "../controllers/customerController";

const customerRouter = express.Router();

customerRouter.get("/add", customerController.addCustomer);
customerRouter.post("/add", customerController.postCustomer);
customerRouter.get("/view/:id", customerController.view);
customerRouter.get("/edit/:id", customerController.edit);
customerRouter.put("/edit/:id", customerController.editPost);
customerRouter.delete("/edit/:id", customerController.deleteCustomer);
customerRouter.post("/search", customerController.searchCustomers);

export default customerRouter;
