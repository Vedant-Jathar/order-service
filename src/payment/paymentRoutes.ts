import { Router } from "express";
import { asyncWrapper } from "../utils";
import { PaymentController } from "./paymentController";
import { createMessageBroker } from "../common/middleware/fatories/brokerFactory";

const router = Router()

const broker = createMessageBroker()
const paymentController = new PaymentController(broker)
router.post("/webhook", asyncWrapper(paymentController.webhook))

export default router