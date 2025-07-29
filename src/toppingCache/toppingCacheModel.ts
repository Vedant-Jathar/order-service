import mongoose from "mongoose";

const toppingCacheSchema = new mongoose.Schema({
    toppingId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    }
})

export default mongoose.model("toppingCache", toppingCacheSchema, "toppingCache")