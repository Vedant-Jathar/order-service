import { Request, Response } from "express";
import { cachedProduct, cachedTopping, CartItem } from "../types";
import productCacheModel from "../productCache/productCacheModel";
import toppingCacheModel from "../toppingCache/toppingCacheModel";
import couponModel from "../coupon/couponModel";

export class OrderController {
    constructor() {
    }

    create = async (req: Request, res: Response) => {
        console.log("Hello");

        const { cart, couponCode, tenantId } = req.body
        const subTotal = await this.calculateTotal(cart)

        let discountPercentage = 0

        if (couponCode) {
            console.log("couponCode", couponCode);

            discountPercentage = await this.getDiscountPercentage(couponCode, tenantId)
            console.log("discountPercentage", discountPercentage);

        }

        const discountAmount = (subTotal * discountPercentage) / 100

        res.json({ discountAmount })

    }

    private calculateTotal = async (cart: CartItem[]) => {
        // Storing the ids of the products in the cart
        const productIds = cart.map(cartItem => cartItem.product._id)

        // todo: If product is not in cache then that product will be missed out
        const productPricings = await productCacheModel.find({
            productId: {
                $in: productIds
            }
        })

        const toppingIds = cart.reduce((acc, curr) => {
            return [
                ...acc,
                ...curr.chosenConfig.selectedToppings.map(topping => topping._id)
            ]
        }, [])

        const toppingPricings = await toppingCacheModel.find({
            toppingId: {
                $in: toppingIds
            }
        })

        const totalPrice = cart.reduce((acc, curr) => {
            const cachedProductPrice = productPricings.find((product) => curr.product._id === product.productId)

            return acc + (curr.qty * this.getItemTotal(curr, cachedProductPrice, toppingPricings))
        }, 0)

        return totalPrice

    }

    private getItemTotal = (curr: CartItem, cachedProductPrice: cachedProduct, toppingPricings: cachedTopping[]) => {

        const toppingsTotal = curr.chosenConfig.selectedToppings.reduce((acc, curr) => {
            const toppingPrice = toppingPricings.find((topping) => topping.toppingId === curr._id)

            return acc + toppingPrice.price
        }, 0)

        let productConfigTotal = 0

        Object.entries(curr.chosenConfig.priceConfig).forEach(([key, value]) => {

            productConfigTotal += cachedProductPrice.priceConfiguration.get(key).availableOptions.get(value)
        })

        return toppingsTotal + productConfigTotal
    }

    private getDiscountPercentage = async (couponCode: string, tenantId: string) => {
        const CouponCode = await couponModel.findOne({
            code: couponCode, tenantId
        })

        console.log("Coupon foind", CouponCode);

        if (!CouponCode) {
            return 0
        }

        const currentDate = new Date()
        const couponExpirydate = new Date(CouponCode.validUpto)
        console.log("currentDate", currentDate);
        console.log("couponExpirydate", couponExpirydate);


        if (currentDate <= couponExpirydate) {
            return CouponCode.discount
        }

        return 0
    }

}