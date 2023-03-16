import { nanoid } from 'nanoid';
import { Product } from './product.model';

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ products: [] }).write();

export class ProductService {
  getAllProducts(): Product[] {
    return db.get('products').value();
  }

  getProductById(productId: string): Product | undefined {
    return db.get('products').find({ id: productId }).value();
  }

  getProductsBySellerId(sellerId: string): Product[] {
    return db.get('products').filter({ sellerId }).value();
  }

  addProduct(product: Product): Product {
    const newProduct = { id: nanoid(), ...product };
    db.get('products').push(newProduct).write();
    return newProduct;
  }

  updateProduct(productId: string, updatedProduct: Product): Product | undefined {
    const product = db.get('products').find({ id: productId });
    if (!product.value()) {
      return undefined;
    }
    product.assign(updatedProduct).write();
    return product.value();
  }

  deleteProduct(productId: string): Product | undefined {
    const product = db.get('products').find({ id: productId });
    if (!product.value()) {
      return undefined;
    }
    db.get('products').remove({ id: productId }).write();
    return product.value();
  }
}
