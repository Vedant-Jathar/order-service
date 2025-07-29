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
            toppingId: topping._id
        },
        {
            $set: {
                toppingId: topping._id,
                price: topping.price,
                tenantId: topping.tenantId
            }
        },
        {
            upsert: true
        }
    )
}