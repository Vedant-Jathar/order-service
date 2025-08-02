import { ProductMessage } from "../types";
import productCacheModel from "./productCacheModel"

export const handleProductCreateUpdate = async (value: string) => {
    console.log("Product creation started");

    let product: ProductMessage
    try {
        product = JSON.parse(value)
        console.log("Product", product);

    } catch (error) {
        console.log("Error parsing the product message");
    }
    await productCacheModel.updateOne(
        {
            productId: product._id
        },
        {
            $set: {
                productId: product._id,
                priceConfiguration: product.priceConfiguration
            }
        },
        {
            upsert: true
        })
    console.log("Product creation enende");

}