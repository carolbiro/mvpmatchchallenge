import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validateRequest } from "../_middlewares/validate-request";
import { ProductService } from "./product.service";
import { Product } from "./product.model";
import * as jwt from "jsonwebtoken";
import { User, UserRole } from "../user/user.model";

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
    const user:User = getUserFromAuthHeader(req);
    if(user.role !== UserRole.Seller) {
        return res.status(403).send("Forbidden, only sellers can add products!");
    }
    const { productName, amountAvailable, cost } = req.body;
    const newProduct: Product = { productName, amountAvailable, cost, sellerId: user.id};
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
    const { productName, amountAvailable, cost } = req.body;
    const user:User = getUserFromAuthHeader(req);
    const product = productService.getProductById(id);
    
    // only the seller can update the product
    if(product.sellerId !== user.id){
        return res.status(403).send("Forbidden, product can be updated only by its seller!");
    } 

    const upddateProduct = productService.updateProduct(id, {productName, amountAvailable, cost, sellerId: user.id});
    if(upddateProduct) {
        res.status(200).json(upddateProduct);
    } else {
        res.status(404).send("Product not found");
    }
}

// Route to delete a product
function deleteProduct(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const user:User = getUserFromAuthHeader(req);
    const product = productService.getProductById(id);

    // only the seller can update the product
    if(product.sellerId !== user.id){
        return res.status(403).send("Forbidden, product can be deleted only by its seller!");
    }

    productService.deleteProduct(id);
    res.status(204).send("Product was successfully deleted!");
}

function validateSchema(req, res, next) {
    const schema = Joi.object({
        productName:  Joi.string().required(),
        amountAvailable:  Joi.number().required(),
        cost:  Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function getUserFromAuthHeader(req:Request):User {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    return user;
}