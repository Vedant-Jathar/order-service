import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import createHttpError from "http-errors";
import { CouponService } from "./couponService";
import { Coupon } from "./couponTypes";
import CouponModel from "./couponModel";

export class CouponController {
    constructor(private couponService: CouponService) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {

        const { title, code, discount, validUpto, tenantId } = req.body

        if ((req.auth.role === "manager" && String(req.auth.tenantId) !== String(tenantId))) {
            throw createHttpError(403, "Forbidden error")
        }

        const coupon = await this.couponService.createCoupon({ title, code, discount, validUpto, tenantId })

        res.json(coupon)
    }

    verify = async (req: Request, res: Response, next: NextFunction) => {

        const { code, tenantId } = req.body
        const coupon: Coupon = await CouponModel.findOne({ code, tenantId })

        if (!coupon) {
            throw createHttpError(400, "Invalid coupon")
        }

        const currentDate = new Date()
        const couponExpiryDate = new Date(coupon.validUpto)

        if (currentDate >= couponExpiryDate) {
            return res.json({ valid: false, discount: 0 })
        }

        return res.json({ valid: true, discount: coupon.discount })

    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        const { title, code, discount, validUpto, tenantId } = req.body
        const { id } = req.params

        if ((req.auth.role === "manager" && String(req.auth.tenantId) !== String(tenantId))) {
            throw createHttpError(403, "Forbidden error")
        }

        const coupon = await this.couponService.updateCoupon({ title, code, discount, validUpto, tenantId }, id)

        res.json(coupon)
    }

    getCoupons = async (req: Request, res: Response, next: NextFunction) => {
        if (req.auth.role === "customer") {
            throw createHttpError(403, "Forbidden error")
        }

        let coupons: Coupon[]

        if (req.auth.role === "manager") {
            const tenantId = req.auth.tenantId
            coupons = await this.couponService.getCoupons(tenantId)
        } else {
            coupons = await this.couponService.getCoupons(null)
        }

        res.json(coupons)

    }

    delete = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        const coupon = await this.couponService.findCouponById(id)

        if (!coupon) {
            throw createHttpError(404, "Coupon Not found")
        }

        if ((req.auth.role === "manager") && (String(req.auth.tenantId) !== String(coupon.tenantId))) {
            throw createHttpError(403, "Forbidden error")
        }

        await this.couponService.deleteCoupon(id)

        res.json({})
    }
}