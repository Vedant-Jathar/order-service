import express from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRoutes from "./customer/customerRoutes"
import couponRoutes from "./coupon/couponRoutes"
import orderRoutes from "./order/orderRoutes"
import paymentRoutes from "./payment/paymentRoutes"
import cors from "cors"
import config from "config"

const app = express();

const ALLOWED_DOMAINS = [config.get("frontend.clientUI"), config.get("frontend.adminUI")]
console.log("ALLOWED_HEADERS", ALLOWED_DOMAINS);

app.use(
    cors({
        origin: ALLOWED_DOMAINS as string[],
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/customer", customerRoutes)
app.use("/coupons", couponRoutes)
app.use("/orders", orderRoutes)
app.use("/payments", paymentRoutes)

app.use(globalErrorHandler);

export default app;
