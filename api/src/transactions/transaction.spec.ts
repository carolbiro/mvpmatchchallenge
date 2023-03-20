import request from 'supertest';
import { app } from '../server';
import { DB_FILE } from '../utils';
import { UserRole } from '../users/user.model';
import { Product } from '../products/product.model';
import { AuthService } from '../auth/auth.service';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync(DB_FILE);
const db = low(adapter);
const authService = new AuthService();

describe('Testing ', () => {
  beforeAll(() => {
    // Seed the database with test data
    const users = [
        { id: '1', username: 'buyer1', password: 'password1', deposit: 500, role: UserRole.Buyer },
        { id: '2', username: 'seller1', password: 'password2', deposit: 0, role: UserRole.Seller },
    ];
    const products = [
        { id: '1', productName: 'Product 1', cost: 200, amountAvailable: 10, sellerId:'2' },
        { id: '2', productName: 'Product 2', cost: 300, amountAvailable: 5, sellerId:'2' },
    ];
    db.set('users', users).write();
    db.set('products', products).write();
  });

  it('db should have data', () => {
      const users = db.get('users').value();
      const products = db.get('products').value();
      expect(users.length).toEqual(2);
      expect(products.length).toEqual(2);
  });

  afterAll(() => {
      // Clear the test database
      db.setState({ users: [], products: []}).write();
  });
  
  describe('Buy Endpoint', () => {
    describe('with valid data', () => {
        let response: any;
  
        beforeAll(async () => {
            const buyer = db.get('users').find({ username: 'buyer1' }).value();
            const product = db.get('products').find({ productName: 'Product 1' }).value();
            const data = { "productId": product.id, "amount": 2 };
            const token = authService.generateAccessToken(buyer);
  
            // Perform the buy request
            response = await request(app)
            .post(`/transactions/buy`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        });
  
        it('should return a 200 status code', () => {
            expect(response.status).toBe(200);
        });
  
        it('should return the correct total amount spent', () => {
            const product = db.get('products').find({ productName: 'Product 1' }).value();
            expect(response.body.totalSpent).toBe(product.cost * 2);
        });
  
        it('should return the correct products purchased', () => {
            const expectedProducts: Product[] = [
                { id: '1', productName: 'Product 1', cost: 200, amountAvailable: 8 , sellerId: '2'},
            ];
            expect(response.body.products).toEqual(expectedProducts);
        });
  
        it('should return the correct change', () => {
            const expectedChange = [100];
            expect(response.body.change).toEqual(expectedChange);
        });
    });
  
    describe('with invalid product id', () => {
        let response: any;
  
        beforeAll(async () => {
            const buyer = db.get('users').find({ username: 'buyer1' }).value();
            const data = { productId: 'invalid', amount: 2 };
  
            // Perform the buy request
            response = await request(app)
            .post(`/transactions/buy`)
            .set('Authorization', `Bearer ${authService.generateAccessToken(buyer)}`)
            .send(data);
        });
  
        it('should return a 404 status code', () => {
            expect(response.status).toBe(404);
        });
  
        it('should return an error message', () => {
            expect(response.body.message).toBe("Product not found");
        });
    });
  
    describe('with insufficient quantity of product', () => {
      let response: any;
    
      beforeAll(async () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        const product = db.get('products').find({ productName: 'Product 1' }).value();
        const data = { productId: product.id, amount: 20 };
    
        // Perform the buy request
        response = await request(app)
          .post(`/transactions/buy`)
          .set('Authorization', `Bearer ${authService.generateAccessToken(buyer)}`)
          .send(data);
      });
    
      it('should return a 400 status code', () => {
        expect(response.status).toBe(400);
      });
    
      it('should return an error message', () => {
        expect(response.body.message).toBe('Requested amount not available');
      });
    
      it('should not change the amount available for the product', () => {
        const product = db.get('products').find({ productName: 'Product 1' }).value();
        expect(product.amountAvailable).toBe(10);
      });
    
      it('should not deduct the funds from the buyer', () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        expect(buyer.deposit).toBe(500);
      });
    });
    
    describe('with insufficient funds', () => {
      let response: any;
    
      beforeAll(async () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        const product = db.get('products').find({ productName: 'Product 1' }).value();
        const data = { productId: product.id, amount: 3 };
    
        // Perform the buy request
        response = await request(app)
          .post(`/transactions/buy`)
          .set('Authorization', `Bearer ${authService.generateAccessToken(buyer)}`)
          .send(data);
      });
    
      it('should return a 400 status code', () => {
        expect(response.status).toBe(400);
      });
    
      it('should return an error message', () => {
        expect(response.body.message).toBe('Insufficient funds');
      });
    
      it('should not change the amount available for the product', () => {
        const product = db.get('products').find({ productName: 'Product 1' }).value();
        expect(product.amountAvailable).toBe(10);
      });
    
      it('should not deduct the funds from the buyer', () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        expect(buyer.deposit).toBe(500);
      });
    });
  
    describe('with a seller trying to buy a product', () => {
        let response: any;
      
        beforeAll(async () => {
          const seller = db.get('users').find({ username: 'seller1' }).value();
          const product = db.get('products').find({ productName: 'Product 1' }).value();
          const data = { productId: product.id, amount: 2 };
      
          // Perform the buy request
          response = await request(app)
            .post(`/transactions/buy`)
            .set('Authorization', `Bearer ${authService.generateAccessToken(seller)}`)
            .send(data);
        });
      
        it('should return a 401 status code', () => {
          expect(response.status).toBe(401);
        });
      
        it('should return an error message', () => {
          expect(response.body.message).toBe('Only buyers can purchase products');
        });
    });
  
    describe('with an invalid product amount', () => {
      let response: any;
  
      beforeAll(async () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        const product = db.get('products').find({ productName: 'Product 1' }).value();
        const data = { productId: product.id, amount: 0 };
  
        // Perform the buy request
        response = await request(app)
          .post(`/transactions/buy`)
          .set('Authorization', `Bearer ${authService.generateAccessToken(buyer)}`)
          .send(data);
      });
  
      it('should return a 400 status code', () => {
        expect(response.status).toBe(400);
      });
  
      it('should return an error message', () => {
        expect(response.body.message).toBe("Invalid request body");
      });
    });
  });
  
  describe('Deposit Endpoint', () => {
    let response: any;
    describe('with valid data', () => {
      beforeAll(async () => {
          const buyer = db.get('users').find({ username: 'buyer1' }).value();
          const data = { "deposit" : 100 };
          const token = authService.generateAccessToken(buyer);

          // Perform the deposit request
          response = await request(app)
          .post(`/transactions/deposit`)
          .set('Authorization', `Bearer ${token}`)
          .send(data);
      });
  
      it('should return a 200 status code', () => {
          expect(response.status).toBe(200);
      });

      it('should add the deposit amount to the user\'s deposit balance', () => {
          db.read();
          const updatedBuyer = db.get('users').find({ username: 'buyer1' }).value();
          expect(updatedBuyer.deposit).toBe(600); // original deposit was 500
      });
    });

    describe('when a user with a Seller role tries to deposit coins', () => {
      beforeAll(async () => {
          const seller = db.get('users').find({ username: 'seller1' }).value();
          const data = { "deposit" : 100 };
          const token = authService.generateAccessToken(seller);
    
          // Perform the deposit request
          response = await request(app)
            .post(`/transactions/deposit`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        });
  
      it('should return a 403 status code', () => {
        expect(response.status).toBe(403);
      });
  
      it('should return an error message', () => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Forbiden, only users with buyer role can deposit coins!');
      });
  
      it('should not update the seller user\'s deposit', () => {
        const seller = db.get('users').find({ username: 'seller1' }).value();
        expect(seller.deposit).toBe(0);
      });
    });
      
    describe('with a buyer trying to deposit an invalid coin denomination', () => {
      beforeAll(async () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        const data = { "deposit" : 55 };
        const token = authService.generateAccessToken(buyer);

        response = await request(app)
          .post(`/transactions/deposit`)
          .set('Authorization', `Bearer ${token}`)
          .send(data);
      });

      it('should return a 400 status code', () => {
        expect(response.status).toBe(400);
      });

      it('should not update the user\'s deposit in the database', () => {
        const buyer = db.get('users').find({ username: 'buyer1' }).value();
        expect(buyer.deposit).toBe(600);
      });
    });

    describe('Test that the endpoint returns the correct updated deposit amount after a successful deposit', () => {
      let buyer, token;
      const data = { "deposit" : 100 };
      beforeAll(async () => {
        // Find a buyer user in the db and generate a token
        buyer = db.get('users').find({ username: 'buyer1' }).value();
        token = authService.generateAccessToken(buyer);
        
        // Perform the deposit request
        response = await request(app)
          .post(`/transactions/deposit`)
          .set('Authorization', `Bearer ${token}`)
          .send(data);
      });
  
      it('should return a 200 status code', () => {
        expect(response.status).toBe(200);
      });
  
      it('should return the updated deposit amount', () => {
        const expectedDeposit = buyer.deposit + data.deposit;
        expect(response.body.deposit).toBe(expectedDeposit);
      });
  
      it('should update the user deposit amount in the database', () => {
        db.read();
        const updatedUser = db.get('users').find({ id: buyer.id }).value();
        expect(updatedUser.deposit).toBe(buyer.deposit + data.deposit);
      });
    });

    describe('Test that the endpoint returns the correct error response if the user tries to deposit coins into another user\'s account', () => {
      let seller, token;
      const data = { "deposit" : 100 };
      beforeAll(async () => {
        // Find a seller user in the db and generate a token
        seller = db.get('users').find({ username: 'seller1' }).value();
        token = authService.generateAccessToken(seller);
        
        // Perform the deposit request
        response = await request(app)
          .post(`/transactions/deposit`)
          .set('Authorization', `Bearer ${token}`)
          .send(data);
      });
    
      it('should return a 403 status code', () => {
        expect(response.status).toBe(403);
      });
    
      it('should return an error message', () => {
        expect(response.body.message).toBe('Forbiden, only users with buyer role can deposit coins!');
      });
    });
  }); 
});
