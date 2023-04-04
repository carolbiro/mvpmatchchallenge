export const USER_ACTION_TYPES = {
    SET_CURRENT_USER: 'SET_CURRENT_USER'
}

export enum UserRole {
    "Seller" = "seller",
    "Buyer" = "buyer"
}

export type User ={
    id?: string;
    username: string;
    password?: string;
    deposit: number;
    role: UserRole;
}