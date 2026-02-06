export type Product = {
    id: string;
    name: string;
    category: 'Food' | 'Drink';
    price: number;
    stock: number;
    unit: string;
};

export type Sale = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    total: number;
    date: string;
};

export type Expense = {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
};

export type Debt = {
    id: string;
    customerName: string;
    amount: number;
    description: string;
    dueDate: string;
    status: 'Pending' | 'Paid';
    date: string;
};

export const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Shawarma', category: 'Food', price: 2500, stock: 50, unit: 'wraps' },
    { id: '2', name: 'Zobo Drink', category: 'Drink', price: 500, stock: 100, unit: 'bottles' },
    { id: '3', name: 'Smoothie', category: 'Drink', price: 1500, stock: 30, unit: 'cups' },
    { id: '4', name: 'Tigernut Drink', category: 'Drink', price: 800, stock: 60, unit: 'bottles' },
];

export const MOCK_SALES: Sale[] = [
    { id: '1', productId: '1', productName: 'Shawarma', quantity: 2, total: 5000, date: '2026-02-06' },
    { id: '2', productId: '2', productName: 'Zobo Drink', quantity: 5, total: 2500, date: '2026-02-06' },
    { id: '3', productId: '1', productName: 'Shawarma', quantity: 1, total: 2500, date: '2026-02-05' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: '1', description: 'Flour and Meat', amount: 15000, category: 'Supplies', date: '2026-02-04' },
    { id: '2', description: 'Zobo leaves', amount: 2000, category: 'Supplies', date: '2026-02-04' },
];
