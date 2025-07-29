import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { CouponService } from "./couponService";
import { CouponController } from "./couponController";
import { canAcces } from "../common/middleware/canAccess";
import { createCouponValidator, verifyCouponValidator } from "./couponValidators";

const router = Router()

const couponService = new CouponService()
const couponController = new CouponController(couponService)

router.post('/', authenticate, canAcces(["admin", "manager"]), createCouponValidator, asyncWrapper(couponController.create))

router.post("/verify", authenticate, verifyCouponValidator, asyncWrapper(couponController.verify))
 
router.patch('/:id', authenticate, canAcces(["admin", "manager"]), createCouponValidator, asyncWrapper(couponController.update))

router.get("/", authenticate, asyncWrapper(couponController.getCoupons))

router.delete("/:id", authenticate, canAcces(["admin", "manager"]), asyncWrapper(couponController.delete))

export default router