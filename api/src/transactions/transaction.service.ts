import { User, UserRole } from '../users/user.model';
import { DB_FILE } from '../utils';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync(DB_FILE);
const db = low(adapter);

export class TransactionService {
  depositCoins(userId: string, amount: number): User | undefined {
    // Force lowdb to read from disk to get the latest data
    db.read();
    // Find the user and update his/her deposit
    const user = db.get('users').find({ id: userId });
    if (!user.value() || user.get('role').value() !== UserRole.Buyer) {
      return undefined;
    }
    user.update('deposit', (deposit:number) => deposit + amount).write();
    return user.value();
  }

  calculateChange(user: User, validCoins:number[]) {
    const denominations = validCoins;
    const coins: number[] = [];
    let remainingAmount = user.deposit;
    for (let i = denominations.length - 1; i >= 0; i--) {
      const coin = denominations[i];
      while (remainingAmount >= coin) {
        coins.push(coin);
        remainingAmount -= coin;
      }
    }
  
    return coins;
  }
}