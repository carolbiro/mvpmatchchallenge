import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validateRequest } from "../_middlewares/validate-request";
import { ProductService } from "./product.service";
import { Product } from "./product.model";

export const productRouter = express.Router();
const productService = new ProductService();

// routes
productRouter.post("/", validateSchema, addProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", validateSchema, updateProduct);
productRouter.delete("/:id", deleteProduct);

// Route to create a product
function addProduct(req: Request, res: Response, next: NextFunction) {
    const { productName, amountAvailable, cost, sellerId} = req.body;
    const newProduct: Product = { productName, amountAvailable, cost, sellerId};
    const product =  productService.addProduct(newProduct);
    res.status(201).json(product);
};

// Route to get all products
function getAllProducts(req: Request, res: Response, next: NextFunction) {
    console.log("Getting all products...");
    const products = productService.getAllProducts();
    res.json(products);
};

// Route to get a single product by ID
function getProductById(req: Request, res: Response, next: NextFunction) {
    console.log(`Getting product with ID ${req.params.id}...`);
    const product = productService.getProductById(req.params.id);
    res.json(product);
};

  // Route to update a product
function updateProduct(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const { productName, amountAvailable, cost, sellerId } = req.body;
    const upddateProduct = productService.updateProduct(id, {productName, amountAvailable, cost, sellerId });
    if(upddateProduct) {
        res.status(200).json(upddateProduct);
    } else {
        res.status(404).send("Product not found");
    }
}

  // Route to delete a product
function deleteProduct(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    productService.deleteProduct(id);
    res.status(204).send();
}

function validateSchema(req, res, next) {
    const schema = Joi.object({
        sellerId: Joi.string().required(),
        productName:  Joi.string().required(),
        amountAvailable:  Joi.number().required(),
        cost:  Joi.number().required()
    });
    validateRequest(req, next, schema);
}
