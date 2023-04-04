export const PRODUCTS_ACTION_TYPES = {
    SET_CURRENT_PRODUCTS: 'SET_CURRENT_PRODUCTS'
}

export type Product = {
    id?: string;
    productName: string;
    amountAvailable: number;
    cost: number;
    sellerId: string;
}