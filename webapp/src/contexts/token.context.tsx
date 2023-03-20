import { createContext, useState } from 'react';
interface TokenContextProps {
    currentToken: null | string;
    setCurrentToken: (currentUser: null | string) => void;
}

export const TokenContext = createContext<TokenContextProps>({
    currentToken: null,
    setCurrentToken: () => null,
});

interface TokenProviderProps {
    children: React.ReactNode;
}
export const TokenProvider = ({ children }: TokenProviderProps) => {
    const [currentToken, setCurrentToken] = useState<null | string>(null);
    const value = { currentToken: currentToken, setCurrentToken: setCurrentToken };
    return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}