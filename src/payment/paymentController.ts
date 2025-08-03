import { NextFunction, Request, Response } from "express";
import orderModel from "../order/orderModel";
import { PaymentStatus } from "../order/orderTypes";
import config from "config"
import crypto from "crypto"
import { MessageBroker } from "../types/broker";

export class PaymentController {
    constructor(private broker: MessageBroker) {
    }
    webhook = async (req: Request, res: Response, next: NextFunction) => {

        const webhookSecret: string = config.get("webhook.secret")

        const signature = req.headers["x-razorpay-signature"] as string;

        const body = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Invalid webhook signature");
            return res.status(400).send("Invalid signature");
        }

        const event = req.body.event

        if (event === "payment_link.paid") {
            const paymentEntity = req.body.payload?.payment?.entity;
            console.log("paymentEntity", paymentEntity);
            console.log("paymentEntity.notes", paymentEntity.notes);

            const orderId = paymentEntity.notes.orderId

            const updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId },
                {
                    $set: { paymentStatus: PaymentStatus.PAID }
                },
                {
                    new: true
                })

            await this.broker.sendMessage("order", JSON.stringify(updatedOrder))
        }

        res.json({})

    }
} 