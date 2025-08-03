import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { OrderController } from "./orderController";
import { createOrderValidator } from "./orderValidator";
import { createMessageBroker } from "../common/middleware/fatories/brokerFactory";
import { canAcces } from "../common/middleware/canAccess";
import { Roles } from "../types";

const router = Router()

const broker = createMessageBroker()

const orderController = new OrderController(broker)

router.post("/", authenticate, createOrderValidator, asyncWrapper(orderController.create))
router.get("/", authenticate, canAcces([Roles.ADMIN, Roles.MANAGER]), asyncWrapper(orderController.getAll))
router.get("/mine", authenticate, asyncWrapper(orderController.getMineOrders))
router.get("/:id", authenticate, asyncWrapper(orderController.getSingleOrder))

export default router