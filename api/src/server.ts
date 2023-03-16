import bodyParser from "body-parser";
import cors from "cors";
import { userRouter } from "./users/user.controller";
import { productRouter } from "./products/product.controller";
const express = require('express');
import type { Request, Response, NextFunction } from 'express';

const app = express();

// Add middleware
app.use(express.json());

// middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// middleware to log responses
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function (body): any{
    console.log(body);
    originalSend.call(this, body);
  };
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to check if the server is running
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Server is running");
});

// User routes
app.use("/users", userRouter);
app.use("/products", productRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  switch (true) {
    case typeof err === 'string':
        // custom application error
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    default:
        return res.status(500).json({ message: err.message });
  }
  // res.status(500).send("Something broke!");
});

// Start server
const  port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
