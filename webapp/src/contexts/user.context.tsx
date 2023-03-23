import { createContext, useState } from 'react';
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

interface UserContextProps {
    currentUser: null | User;
    setCurrentUser: (currentUser: null | User) => void;
}

export const UserContext = createContext<UserContextProps>({
    currentUser: null,
    setCurrentUser: () => null,
});

interface UserProviderProps {
    children: React.ReactNode;
}
export const UserProvider = ({ children }: UserProviderProps) => {
    const [currentUser, setCurrentUser] = useState<null | User>(null);
    const value = { currentUser: currentUser, setCurrentUser: setCurrentUser };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}