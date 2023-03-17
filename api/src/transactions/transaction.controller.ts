import express, { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../_middlewares/authenticate-routes";
import { TransactionService } from "./transaction.service";
import { ProductService } from "../products/product.service";
import { UserService } from "../users/user.service";
import { User, UserRole } from "../users/user.model";

export const transactionRouter = express.Router();
const transactionService = new TransactionService();
const productService = new ProductService();
const userService = new UserService();

transactionRouter.put("/deposit", deposit);
transactionRouter.post("/:userId/buy", buy);
transactionRouter.post("/reset", resetDeposit);

const VALID_COINS = [5,10,20,50,100];

// Route to deposit coins (for buyers only)
function deposit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (req.user.role !== UserRole.Buyer) {
      return res.status(403).send({ message: 'Forbiden, only users with buyer role can deposit coins!' });
    }

    const { deposit } = req.body;
    if(!VALID_COINS.includes(deposit)) {
      return res.status(400).send({ message: 'Invalid deposit/coin denomination !'})
    }
    
    const updatedDeposit = transactionService.depositCoins(req.user.id, deposit);
    if (updatedDeposit) {
      res.status(200).json(updatedDeposit);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

// Route to buy products (for buyers only)
function buy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Check if user is a buyer
    const user = req.user as User;
    if (user.role !== UserRole.Buyer) {
      return res.status(401).send('Only buyers can purchase products');
    }

    // Validate request body
    const { productId, amount } = req.body;
    if (!productId || !amount || typeof productId !== 'string' || typeof amount !== 'number') {
      return res.status(400).send('Invalid request body');
    }

    // Retrieve product from database
    const product = productService.getProductById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Check if requested amount of product is available
    if (product.amountAvailable < amount) {
      return res.status(400).send('Requested amount not available');
    }

    // Calculate total cost of products
    const totalCost = amount * product.cost;

    // Check in the db if buyer has enough deposited money 
    const deposit = userService.getUserById(user.id).deposit;
    if (deposit < totalCost) {
      return res.status(400).send('Insufficient funds');
    }

    // Deduct total cost from buyer's deposited money
    user.deposit = deposit - totalCost;
    userService.updateUser(user.id, user);
    req.user = user;

    // Update product quantity in database
    product.amountAvailable -= amount;
    productService.updateProduct(productId, product);

    // Calculate change (if any)
    const change = transactionService.calculateChange(user, VALID_COINS);

    // Return success response
    return res.status(200).send({
      totalSpent: totalCost,
      products: [product],
      change
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}

// Route to reset deposit to 0 (for buyers only)
function resetDeposit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try{
    // Check if user is a buyer
    const user = req.user as User;
    if (user.role !== UserRole.Buyer) {
      return res.status(403).send({ message: 'Forbidden, only users with buyer role can reset their deposit!' });
    }

    user.deposit = 0;
    const resetResult = userService.updateUser(user.id, user);
    req.user = user;

    if (resetResult) {
      res.status(200).json(resetResult);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
