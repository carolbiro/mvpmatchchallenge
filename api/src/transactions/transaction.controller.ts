import express, { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../_middlewares/authenticate-routes";
import { TransactionService } from "./transaction.service";
import { UserRole } from "../users/user.model";


export const transactionRouter = express.Router();
const transactionService = new TransactionService();

transactionRouter.put("/:id/deposit", deposit);

const VALID_COINS = [5,10,20,50,100];

// Route to deposit coins (for buyers only)
function deposit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user.role !== UserRole.Buyer) {
      return res.status(403).send({ message: 'Forbiden, only users with buyer role can deposit coins!' });
    }
  
    const userId = req.params.id;
    if(req.user.id !== userId) {
      return res.status(403).send({ message: 'Forbiden, you can only deposit coins in your account!'})
    }
    
    const { deposit } = req.body;
    if(!VALID_COINS.includes(deposit)) {
      return res.status(400).send({ message: 'Invalid deposit/coin denomination !'})
    }
    
    const updatedDeposit = transactionService.depositCoins(userId, deposit);
    if (updatedDeposit) {
      res.status(200).json(updatedDeposit);
    } else {
      res.status(404).send("User not found");
    }
  };