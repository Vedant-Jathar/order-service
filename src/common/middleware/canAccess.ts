import { NextFunction, Response } from "express"
import { Request } from "express-jwt"
import createHttpError from "http-errors"

export const canAcces = (rolesArr: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.auth.role

        if (!rolesArr.includes(role)) {
            next(createHttpError(403, "Forbidden from usage"))
            return
        }
        next()
    }
}
