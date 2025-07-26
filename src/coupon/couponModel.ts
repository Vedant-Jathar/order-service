import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    validUpto: {
        type: Date,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
}, { timestamps: true })


CouponSchema.index({ tenantId: 1, code: 1 }, { unique: true })

export default mongoose.model("Coupon", CouponSchema)