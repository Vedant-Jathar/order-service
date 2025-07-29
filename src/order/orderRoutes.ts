import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { OrderController } from "./orderController";
import { createOrderValidator } from "./orderValidator";

const router = Router()

const orderController = new OrderController()

router.post("/", authenticate, createOrderValidator, asyncWrapper(orderController.create))

export default router