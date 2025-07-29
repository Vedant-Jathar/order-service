import { ProductMessage } from "../types";
import productCacheModel from "./productCacheModel"

export const handleProductCreateUpdate = async (value: string) => {
    let product: ProductMessage
    try {
        product = JSON.parse(value)
    } catch (error) {
        console.log("Error parsing the product message");
    }
    
    await productCacheModel.updateOne(
        {
            _id: product._id
        },
        {
            $set: {
                priceConfiguration: product.priceConfiguration
            }
        },
        {
            upsert: true
        })
}