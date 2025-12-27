import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

interface DataContextType {
    products: Product[];
    recentScans: Product[];
    scanProduct: (id?: string) => Product;
    addToHistory: (product: Product) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [recentScans, setRecentScans] = useState<Product[]>([]);

    const addToHistory = (product: Product) => {
        setRecentScans(prev => [product, ...prev]);
    };

    const scanProduct = (id?: string) => {
        // Random mock scan if no ID provided
        const product = id
            ? MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]
            : MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];

        addToHistory(product);
        return product;
    };

    return (
        <DataContext.Provider value={{ products: MOCK_PRODUCTS, recentScans, scanProduct, addToHistory }}>
            {children}
        </DataContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
