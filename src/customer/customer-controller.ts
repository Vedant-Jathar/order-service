import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { CustomerService } from "./customerService";
import { Logger } from "winston";

export class CustomerController {
    constructor(private customerService: CustomerService, private logger: Logger) {
    }

    getCustomer = async (req: Request, res: Response, next: NextFunction) => {
        const { sub: userId, firstName, lastName, email } = req.auth
        const customer = await this.customerService.getCustomer({ userId, firstName, lastName, email })
        this.logger.info("Customer fetched successfully", { customer })
        res.json(customer)
    }

    addAddress = async (req: Request, res: Response, next: NextFunction) => {
        const { sub: userId } = req.auth
        const { id: customerId } = req.params
        const { address } = req.body

        const customer = await this.customerService.addAddress(userId, customerId, address)
        res.json(customer)
    }
    
}