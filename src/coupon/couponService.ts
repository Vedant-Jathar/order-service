import { Coupon } from "./couponTypes";
import CouponModel from "./couponModel";

export class CouponService {

    createCoupon = async (coupon: Coupon) => {
        const newCoupon = await CouponModel.create(coupon)

        return newCoupon
    }
}