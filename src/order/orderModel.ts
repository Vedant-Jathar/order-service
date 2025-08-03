import mongoose, { Schema } from "mongoose";
import { Order, OrderStatus, PaymentMode, PaymentStatus } from "./orderTypes";
import { CartItem, Topping } from "../types";

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "additional"],
    },
    availableOptions: {
        type: Map,
        of: Number,
    },
});

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
        },
        attributes: [attributeSchema],
        tenantId: {
            type: Number,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        isPublished: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
);


const ToppingSchema = new mongoose.Schema<Topping>({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        required: true
    }
})


const chosenConfigSchema = new mongoose.Schema({
    priceConfig: {
        type: Map,
        of: String
    },
    selectedToppings: {
        type: [ToppingSchema],
        required: true
    }
}
)



const cartItemSchema = new mongoose.Schema<CartItem>({
    hash: {
        type: String,
        required: true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    chosenConfig: {
        type: chosenConfigSchema,
        required: true
    },
    product: {
        type: productSchema,
        required: true
    }

})

const orderSchema = new mongoose.Schema<Order>({
    cart: {
        type: [cartItemSchema],
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Customer"
    },
    tenantId: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    taxes: {
        type: Number,
        required: true
    },
    deliveryCharges: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        enum: PaymentMode,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: PaymentStatus,
        required: true,
        default: PaymentStatus.PENDING
    },
    orderStatus: {
        type: String,
        enum: OrderStatus,
        required: true,
        default: OrderStatus.RECEIVED
    },
    comment: {
        type: String,
        required: false
    },
    paymentId: {
        type: String,
        required: false,
        default: null
    }
}, { timestamps: true })


export default mongoose.model("order", orderSchema)