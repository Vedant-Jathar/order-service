import mongoose from "mongoose"

const idempotencySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    response: {
        type: Object,
        required: true
    }
}, { timestamps: true })

// Change the expiry time to 48 hours:
idempotencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 })
idempotencySchema.index({ key: 1 }, { unique: true })

export default mongoose.model("idempotency", idempotencySchema)
