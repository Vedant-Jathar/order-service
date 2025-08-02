import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { OrderController } from "./orderController";
import { createOrderValidator } from "./orderValidator";
import { createMessageBroker } from "../common/middleware/fatories/brokerFactory";

const router = Router()

const broker = createMessageBroker()


const orderController = new OrderController(broker)

router.post("/", authenticate, createOrderValidator, asyncWrapper(orderController.create))
router.get("/mine", authenticate, asyncWrapper(orderController.getMineOrders))

export default router