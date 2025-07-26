import { body } from "express-validator"

export const createCouponValidator = [
    body("title")
        .exists()
        .withMessage("Title is required"),
    body("code")
        .exists()
        .withMessage("Code is required"),
    body("discount")
        .exists()
        .withMessage("Discount is required")
        .isNumeric()
        .withMessage("Discount shoud be a number"),
    body("validUpto")
        .exists()
        .withMessage("ValidUpto is required")
        .isDate()
        .withMessage("validUpto should be a data"),
    body("tenantId")
        .exists()
        .withMessage("TenantId is required"),
]

export const verifyCouponValidator = [
    body("code")
        .exists()
        .withMessage("Code is required"),
    body("tenantId")
        .exists()
        .withMessage("TenantId is required"),

]