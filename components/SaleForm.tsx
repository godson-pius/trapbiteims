"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Product } from '@/lib/data';

interface SaleFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function SaleForm({ onSuccess, onCancel }: SaleFormProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const productId = formData.get('productId') as string;
        const product = products.find(p => p.id === productId);

        if (!product) {
            setError('Please select a product');
            setIsSubmitting(false);
            return;
        }

        const quantity = Number(formData.get('quantity'));

        if (quantity > product.stock) {
            setError(`Not enough stock. Available: ${product.stock}`);
            setIsSubmitting(false);
            return;
        }

        const data = {
            productId,
            productName: product.name,
            quantity,
            total: product.price * quantity,
            paymentMethod: formData.get('paymentMethod'),
            date: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to record sale');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Select Product</label>
                {isLoadingProducts ? (
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl text-muted-foreground">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Loading product list...</span>
                    </div>
                ) : (
                    <select
                        name="productId"
                        required
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                    >
                        <option value="">Choose a product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                                {p.name} - {p.stock} {p.unit} available (₦{p.price})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Quantity</label>
                <input
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                    placeholder="Enter quantity"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash"
                            required
                            className="peer hidden"
                            defaultChecked
                        />
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm text-muted-foreground peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all">
                            Cash
                        </div>
                    </label>
                    <label className="cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Transfer"
                            required
                            className="peer hidden"
                        />
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm text-muted-foreground peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all">
                            Transfer
                        </div>
                    </label>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 bg-white border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors text-muted-foreground"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoadingProducts}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Record Sale'}
                </button>
            </div>
        </form>
    );
}
