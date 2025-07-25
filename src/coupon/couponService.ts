import { Coupon } from "./couponTypes";
import CouponModel from "./couponModel";

export class CouponService {

    createCoupon = async (coupon: Coupon) => {
        const newCoupon = await CouponModel.create(coupon)

        return newCoupon
    }

    updateCoupon = async (coupon: Coupon, id: string) => {
        const updatedCoupon = await CouponModel.findOneAndUpdate({
            _id: id
        }, {
            $set: coupon
        },
            { new: true })

        return updatedCoupon
    }

    getCoupons = async (tenantId: string | null) => {
        if (!tenantId) {
            return await CouponModel.find()
        } else {
            return await CouponModel.find({ tenantId: String(tenantId) })
        }
    }

    deleteCoupon = async (id: string) => {
        await CouponModel.deleteOne({ _id: id })
    }

    findCouponById = async (id: string) => {
        return await CouponModel.findById(id)
    }
}