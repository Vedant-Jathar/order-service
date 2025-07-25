import express from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRoutes from "./customer/customerRoutes"
import couponRoutes from "./coupon/couponRoutes"

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/customer", customerRoutes)
app.use("/coupons", couponRoutes)

app.use(globalErrorHandler);

export default app;
