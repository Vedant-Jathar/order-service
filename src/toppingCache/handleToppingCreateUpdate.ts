import { ToppingMessage } from "../types"
import toppingCacheModel from "./toppingCacheModel"

export const handleToppingCreateUpdate = async (value: string) => {
    let topping: ToppingMessage
    try {
        topping = JSON.parse(value)
    } catch (error) {
        console.log("Error in parsing topping message");
    }
    
    await toppingCacheModel.updateOne(
        {
            _id: topping._id
        },
        {
            $set: {
                price: topping.price,
                tenantId: topping.tenantId
            }
        },
        {
            upsert: true
        }
    )
}