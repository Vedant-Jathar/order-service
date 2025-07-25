import { Customer } from "./customerTypes";
import CustomerModel from "./customerModel";

export class CustomerService {
    getCustomer = async (customer: Customer) => {
        const existingCustomer = await CustomerModel.findOne({ userId: customer.userId })
        if (!existingCustomer) {
            const newCustomer = await CustomerModel.create(customer)
            return newCustomer
        }
        return existingCustomer
    }

    addAddress = async (userId: string, customerId: string, address: string) => {
        const customer = CustomerModel.findOneAndUpdate({
            _id: customerId,
            userId
        },
            {
                $push: {
                    addresses: {
                        text: address,
                    }
                }
            })
        return customer
    }
}