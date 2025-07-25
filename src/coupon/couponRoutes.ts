import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { CouponService } from "./couponService";
import { CouponController } from "./couponController";

const router = Router()

const couponService = new CouponService()
const couponController = new CouponController(couponService)
router.post('/', authenticate, asyncWrapper(couponController.create))

export default router