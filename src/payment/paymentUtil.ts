import Razorpay from "razorpay";
import config from "config"

export const razorpay = new Razorpay({
    key_id: config.get("razorPay.id"),
    key_secret: config.get("razorPay.secret"),
});