import { body } from "express-validator";

export const createOrderValidator = [
    body("cart")
        .exists().withMessage("cart is required")
        .isArray().withMessage("cart must be array"),
    body("address")
        .exists().withMessage("address is required")
        .isString().withMessage("address must be a string"),
    body("tenantId")
        .exists().withMessage("tenantId is required")
        .isString().withMessage("tenantId must be a string"),
    body("customerId")
        .exists().withMessage("customerId is required")
        .isString().withMessage("customerId must be a string"),
    body("paymentMode")
        .exists().withMessage("paymentMode is required")
        .isString().withMessage("paymentMode must be a string")
]