import mongoose from "mongoose";
import { CartItem } from "../types";

export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPARED = "prepared",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered"
}

export enum PaymentMode {
    CARD = "card",
    CASH = "cash",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}

export interface Order {
    cart: CartItem[],
    customerId: mongoose.Types.ObjectId,
    tenantId: string,
    comment?: string,
    address: string,
    total: number,
    taxes: number,
    discount: number,
    deliveryCharges: number,
    paymentMode: PaymentMode,
    paymentStatus: PaymentStatus,
    paymentId: string,
    orderStatus: OrderStatus
}

export interface OrderQuery {
    page: string,
    limit: string,
    tenantId: string
}