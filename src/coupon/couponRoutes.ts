import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { CouponService } from "./couponService";
import { CouponController } from "./couponController";
import { canAcces } from "../common/middleware/canAccess";

const router = Router()

const couponService = new CouponService()
const couponController = new CouponController(couponService)

router.post('/', authenticate, canAcces(["admin", "manager"]), asyncWrapper(couponController.create))

router.patch('/:id', authenticate, canAcces(["admin", "manager"]), asyncWrapper(couponController.update))

router.get("/", authenticate, asyncWrapper(couponController.getCoupons))

router.delete("/:id", authenticate, canAcces(["admin", "manager"]), asyncWrapper(couponController.delete))

export default router