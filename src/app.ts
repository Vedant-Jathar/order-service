import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRoutes from "./customer/customerRoutes"

const app = express();
app.use(cookieParser());
app.use(express.json());


app.use("/customer",customerRoutes)



app.use(globalErrorHandler);

export default app;
