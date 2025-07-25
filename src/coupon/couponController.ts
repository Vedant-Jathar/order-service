import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import createHttpError from "http-errors";
import { CouponService } from "./couponService";

export class CouponController {
    constructor(private couponService: CouponService) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {

        const { title, code, discount, validUpto, tenantId } = req.body

        if ((req.auth.role === "manager" && String(req.auth.tenantId) !== String(tenantId)) || req.auth.role === "customer") {
            throw createHttpError(403, "Forbidden error")
        }

        const coupon = await this.couponService.createCoupon({ title, code, discount, validUpto, tenantId })

        res.json(coupon)

    }

  
}