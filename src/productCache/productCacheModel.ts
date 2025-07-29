import mongoose from "mongoose";

// const priceConfiguration =
// {
//     "Size":
//     {
//         "priceType": "base",
//         "availableOptions": {
//             "100ml": 400,
//             "330ml": 600,
//             "500ml": 800
//         }
//     },

//     "Chilling":
//     {
//         "priceType": "additional",
//         "availableOptions": {
//             "Warm": 0,
//             "Cold": 100
//         }
//     }
// }

const pricingSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"]
    },
    availableOptions: {
        type: Map,
        of: Number,
    }
})

const productCacheSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    priceConfiguration: {
        type: Map,
        of: pricingSchema,
        required: true
    }
})

export default mongoose.model("productCacheSchema", productCacheSchema, "productsCache")