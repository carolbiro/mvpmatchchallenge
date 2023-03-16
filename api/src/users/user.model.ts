export type User = {
    id?: string;
    username: string;
    password?: string;
    deposit: number;
    role: UserRole;
    products?: {
      id: string;
      productName: string;
      amountAvailable: number;
      cost: number;
      sellerId: string;
    }[];
}

export enum UserRole {
    "Seller" = "seller",
    "Buyer" = "buyer"
}