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
export type Authentication = {
    accessToken: string;
    refreshToken: string;
    user : User
}

interface AuthenticationContextProps {
    currentAuthentication: null | Authentication;
    setCurrentAuthentication: (currentAuthentication: null | Authentication) => void;
}

export const AuthenticationContext = createContext<AuthenticationContextProps>({
    currentAuthentication: null,
    setCurrentAuthentication: () => null,
});

interface AuthenticationProviderProps {
    children: React.ReactNode;
}
export const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
    const [currentAuthentication, setCurrentAuthentication] = useState<null |Authentication>(null);
    const value = { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication };
    return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}