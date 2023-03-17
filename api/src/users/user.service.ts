import { nanoid } from 'nanoid';
import { User, UserRole } from './user.model';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync('db.json')
const db = low(adapter);

db.defaults({ users: [] }).write();

export class UserService {
  getUsers(): User[] {
    db.read();
    return db.get('users').value();
  }

  getUserById(userId: string): User | undefined {
    db.read();
    return db.get('users').find({ id: userId }).value();
  }

  getUserByUsername(username: string): User | undefined {
    db.read();
    return db.get('users').find({ username }).value();
  }

  addUser(user: User): User {
    const newUser = { ...user, id: nanoid() };
    db.get('users').push(newUser).write();
    return newUser;
  }

  updateUser(userId: string, updatedUser: User): User | undefined {
    const user = db.get('users').find({ id: userId });
    if (!user.value()) {
      return undefined;
    }
    user.assign(updatedUser).write();
    return user.value();
  }

  deleteUser(userId: string): User | undefined {
    const user = db.get('users').find({ id: userId });
    if (!user.value()) {
      return undefined;
    }
    db.get('users').remove({ id: userId }).write();
    return user.value();
  }
}
