import mongoose from "mongoose";
import { Address, Customer } from "./customerTypes";

const AddressSchema = new mongoose.Schema<Address>({
    text: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    _id: false,
    strict: true
})

const CustomerSchema = new mongoose.Schema<Customer>({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    addresses: {
        type: [AddressSchema],
        required: false,
        default: []
    }
})

export default mongoose.model("Customer", CustomerSchema)