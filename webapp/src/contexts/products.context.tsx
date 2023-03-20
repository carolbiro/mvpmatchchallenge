import { createContext, useState } from 'react';
interface ProductsContextProps {
    currentProducts: [];
    setCurrentProducts: (currentProducts: [] ) => void;
}

export const ProductsContext = createContext<ProductsContextProps>({
    currentProducts: [],
    setCurrentProducts: () => null,
});

interface ProductsProviderProps {
    children: React.ReactNode;
}
export const ProductsProvider = ({ children }: ProductsProviderProps) => {
    const [currentProducts, setCurrentProducts] = useState<[]>([]);
    const value = { currentProducts: currentProducts, setCurrentProducts: setCurrentProducts };
    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}