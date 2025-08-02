import express from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRoutes from "./customer/customerRoutes"
import couponRoutes from "./coupon/couponRoutes"
import orderRoutes from "./order/orderRoutes"
import paymentRoutes from "./payment/paymentRoutes"
import cors from "cors"

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/customer", customerRoutes)
app.use("/coupons", couponRoutes)
app.use("/orders", orderRoutes)
app.use("/payments", paymentRoutes)
app.use(globalErrorHandler);

export default app;
