import { createContext, useState } from 'react';
export type Product = {
    id?: string;
    productName: string;
    amountAvailable: number;
    cost: number;
    sellerId: string;
}

interface ProductsContextProps {
    currentProducts: Product[];
    setCurrentProducts: (currentProducts: Product[]) => void;
}

export const ProductsContext = createContext<ProductsContextProps>({
    currentProducts: [],
    setCurrentProducts: () => null,
});

interface ProductsProviderProps {
    children: React.ReactNode;
}
export const ProductsProvider = ({ children }: ProductsProviderProps) => {
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
    const value = { currentProducts: currentProducts, setCurrentProducts: setCurrentProducts };
    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}