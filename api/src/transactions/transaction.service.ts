import { User, UserRole } from '../users/user.model';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync('db.json')
const db = low(adapter);

export class TransactionService {
    depositCoins(userId: string, amount: number): User | undefined {
        const user = db.get('users').find({ id: userId });
        if (!user.value() || user.get('role').value() !== UserRole.Buyer) {
          return undefined;
        }
        user.update('deposit', (deposit:number) => deposit + amount).write();
        return user.value();
      }
}