import request from 'supertest';
import { start } from '../server';
import { DB_FILE } from '../utils';
import { UserRole } from '../users/user.model';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync(DB_FILE);
const db = low(adapter);
const app = start();

describe('POST /users', () => {
  beforeAll(() => {
    // Seed the database with test data
    db.setState({ users: [], products: []}).write();
  });

  afterAll(() => {
    // Clear the test database
    db.setState({ users: [], products: []}).write();
    app.close();
  });

  it('should add a new user to the database', async () => {
    const newUser = {
      username: 'newuser',
      password: 'newpassword',
      role: UserRole.Buyer,
      deposit: 0,
    };

    const {password, ...newUserWithoutPassword} = newUser;
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toEqual('newuser');
    expect(response.body).toEqual(expect.objectContaining(newUserWithoutPassword))
    
    db.read();
    const addedUser = db.get('users').find({ username: 'newuser' }).value();
    expect(addedUser).toEqual(expect.objectContaining(newUserWithoutPassword));
  });

  it('should return a 404 status code if the user already exists', async () => {
    const existingUser = {
      username: 'newuser',
      password: 'newpassword',
      role: UserRole.Buyer,
      deposit: 0,
    };

    const response = await request(app).post('/users').send(existingUser);
    expect(response.status).toBe(404);
  });
});
  