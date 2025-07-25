import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { CustomerController } from "./customer-controller";
import { CustomerService } from "./customerService";
import logger from "../config/logger";

const router = Router()

const customerService = new CustomerService()
const customerController = new CustomerController(customerService, logger)

router.get("/", authenticate, asyncWrapper(customerController.getCustomer))

export default router