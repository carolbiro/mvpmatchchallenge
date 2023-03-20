require("dotenv").config();
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import type { Request, Response, NextFunction } from 'express';
import { logRequests, logResponses } from "./_middlewares/logger";
import { errorHandler } from "./_middlewares/error-handler";
import { whitelist } from "./_middlewares/authenticate-routes";
import { authRouter } from "./auth/auth.controller";
import { userRouter } from "./users/user.controller";
import { productRouter } from "./products/product.controller";
import { transactionRouter } from "./transactions/transaction.controller";
import { PORT } from "./utils";

export const app = express();

// Add middleware
app.use(express.json());
app.use(whitelist);

// middleware to log requests
app.use(logRequests);
// middleware to log responses
app.use(logResponses);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to check if the server is running
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Server is running");
});

// User routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/transactions", transactionRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
export let start;
if(process.env.NODE_ENV === 'test') {
  start = (port = PORT) => {
    return app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  };
}
else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

