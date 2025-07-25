import { Customer } from "./customerTypes";
import CustomerModel from "./customerModel";

export class CustomerService {
    constructor() { }
    getCustomer = async (customer: Customer) => {
        const existingCustomer = await CustomerModel.findOne({ userId: customer.userId })
        if (!existingCustomer) {
            const newCustomer = await CustomerModel.create(customer)
            return newCustomer
        }
        return existingCustomer
    }
}