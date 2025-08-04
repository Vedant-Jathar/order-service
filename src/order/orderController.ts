import { NextFunction, Response } from "express";
import { cachedProduct, cachedTopping, CartItem, Roles } from "../types";
import productCacheModel from "../productCache/productCacheModel";
import toppingCacheModel from "../toppingCache/toppingCacheModel";
import couponModel from "../coupon/couponModel";
import orderModel from "./orderModel";
import idempotencyModel from "../idempotency/idempotencyModel";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { razorpay } from "../payment/paymentUtil";
import customerModel from "../customer/customerModel";
import { Order, OrderQuery, OrderStatus, PaymentMode } from "./orderTypes";
import { MessageBroker } from "../types/broker";
import { Request } from "express-jwt";
import { Customer } from "../customer/customerTypes";

export class OrderController {
    constructor(private broker: MessageBroker) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        // Receive this data from the customer:
        const { cart, customerId, couponCode, tenantId, address, comment, paymentMode } = req.body

        if (!tenantId) {
            alert("Pls select restauarnt")
            return
        }

        const customer = await customerModel.findOne({ _id: customerId })

        // Calculate subtotal:
        const subTotal = await this.calculateTotal(cart)

        // Calculate discount:
        let discountPercentage = 0

        if (couponCode) {
            discountPercentage = await this.getDiscountPercentage(couponCode, tenantId)
        }

        const discountAmount = Math.round((subTotal * discountPercentage) / 100)

        // Calculate taxes:
        const priceAfterDiscount = subTotal - discountAmount
        const TAXES_PERCENTAGE = 18

        const taxesAmount = Math.round((priceAfterDiscount * TAXES_PERCENTAGE) / 100)

        // Calculate Delivery Charges:
        const DELIVERY_CHARGES = subTotal <= 200 ? 50 : 0

        // Calculate Grand total:
        const grandTotal = priceAfterDiscount + taxesAmount + DELIVERY_CHARGES

        const idempotencyKey = req.headers["idempotency-key"]

        const idempotency = await idempotencyModel.findOne({ key: idempotencyKey })

        let newOrder = idempotency ? [idempotency.response] : []
        let paymentUrl = null

        if (!idempotency) {
            const session = await mongoose.startSession()
            await session.startTransaction()

            try {
                // Create order:
                newOrder = await orderModel.create([{
                    cart,
                    tenantId,
                    customerId,
                    address,
                    comment,
                    total: grandTotal,
                    discount: discountAmount,
                    taxes: taxesAmount,
                    deliveryCharges: DELIVERY_CHARGES,
                    paymentMode,
                }], { session })

                const order = newOrder[0]

                if (paymentMode === PaymentMode.CARD) {
                    const paymentLink = await razorpay.paymentLink.create({
                        amount: grandTotal * 100,
                        currency: "INR",
                        accept_partial: false,
                        reference_id: order._id.toString(),
                        description: "Payment for pizza order",
                        customer: {
                            name: `${customer.firstName} ${customer.lastName}`,
                            email: customer.email,
                        },
                        notify: {
                            sms: true,
                            email: true,
                        },
                        callback_url: `http://localhost:3000/payment?orderId=${order._id.toString()}&restaurant=${tenantId}`,
                        callback_method: "get",
                        notes: {
                            orderId: order._id.toString(),
                            tenantId
                        }
                    });
                    order.paymentId = paymentLink.id
                    await order.save({ session })
                    paymentUrl = paymentLink.short_url
                }

                // Create idempotency key:
                await idempotencyModel.create([{ key: idempotencyKey, response: order }], { session })

                await session.commitTransaction()
                await this.broker.sendMessage("order", JSON.stringify(order))
                res.json({ paymentUrl, orderId: order._id.toString(), tenantId })
            } catch (error) {
                console.log("error", error);
                await session.abortTransaction()
                await session.endSession()
                return next(createHttpError(500, "Error in order transaction"))
            } finally {
                await session.endSession()
            }

        }

    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {

        const { role, tenantId } = req.auth
        const { page, limit, restaurantId } = req.query

        const pageInt = parseInt(page as string) || 1
        const limitInt = parseInt(limit as string) || 6

        if (role === Roles.ADMIN) {
            const filters = {}
            if (restaurantId) {
                filters["tenantId"] = restaurantId
            }
            const totalOrders = await orderModel.countDocuments(filters)
            const orders = await orderModel.find(filters, {}, { sort: { createdAt: -1 } })
                .skip((pageInt - 1) * limitInt)
                .limit(limitInt)
                .populate("customerId")
                .lean()
                .exec()
            return res.json({ orders, total: totalOrders })
        }

        if (role === Roles.MANAGER) {
            const totalOrders = await orderModel.countDocuments({ tenantId })
            const orders = await orderModel.find({ tenantId }, {}, { sort: { createdAt: -1 } })
                .skip((pageInt - 1) * limitInt)
                .limit(limitInt)
                .populate("customerId")
                .lean()
                .exec()
            return res.json({ orders, total: totalOrders })
        }
    }

    getMineOrders = async (req: Request, res: Response, next: NextFunction) => {
        // Get the user id from the "req.auth" which was set in the authenticate middleware:
        const userId = req.auth.sub
        if (!userId) {
            return next(createHttpError(400, "No user Id found"))
        }

        // Finding the customer by userId:
        const customer = await customerModel.findOne({ userId })
        if (!customer) {
            return next(createHttpError(400, "No customer found"))
        }

        // Get the orders by customer Id:
        const orders = await orderModel.find(
            { customerId: customer._id },
            { cart: 0 }
        )

        res.json(orders)
    }

    getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id: orderId } = req.params
        const { sub: userId, role, tenantId } = req.auth
        const { fields } = req.query as { fields: string }

        let projection = {}

        // If fields are sent then only those fields will be sent in the response.
        if (fields) {
            const fieldsArray = fields.split(",")
            projection = fieldsArray.reduce((acc, curr) => {
                return {
                    ...acc,
                    [curr]: 1
                }
            }, { customerId: 1 })
        }

        let order: Order = await orderModel.findOne({ _id: orderId })
            .populate("customerId")
            .exec()

        if (!order) {
            return next(createHttpError(404, "Order not found"))
        }

        if (role === "manager") {
            if (order.tenantId !== tenantId) {
                return next(createHttpError(403, "Forbidden error-You are a manager of diff tenant"))
            }
        }

        if (role === "customer") {
            const customer: Customer = await customerModel.findOne({ _id: order.customerId })
            if (!customer) {
                return next(createHttpError(404, "Customer not found"))
            }
            if (customer.userId !== userId) {
                return next(createHttpError(403, "Forbidden error - This order doesn't belong to you"))
            }
        }

        if (fields) {
            order = await orderModel.findOne({ _id: orderId }, projection)
                .populate("customerId")
                .exec()
            return res.json(order)
        }

        res.json(order)
    }

    changeStatus = async (req: Request, res: Response, next: NextFunction) => {
        const { role, tenantId } = req.auth
        const { id: orderId } = req.params
        const { status } = req.body
        
        const order = await orderModel.findOne({ _id: orderId })

        if (!order) {
            return next(createHttpError(400, "Order not found"))
        }

        if (role === Roles.MANAGER && tenantId !== order.tenantId) {
            return next(createHttpError(403, "Forbidden:You are not a manager of this tenant"))
        }

        const isStatusValid = [OrderStatus.RECEIVED, OrderStatus.CONFIRMED, OrderStatus.PREPARED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED].includes(status)
        if (!isStatusValid) {
            return next(createHttpError(400, "Invalid status"))
        }

        order.orderStatus = status;
        await order.save()

        res.json(order)
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

        console.log("Coupon found", CouponCode);

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