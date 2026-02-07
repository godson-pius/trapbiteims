"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Expense } from '@/lib/data';

interface ExpenseFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Expense;
}

export default function ExpenseForm({ onSuccess, onCancel, initialData }: ExpenseFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [category, setCategory] = useState(initialData?.category || 'Supplies');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description);
            setAmount(initialData.amount.toString());
            setCategory(initialData.category);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const data = {
            description,
            category,
            amount: Number(amount),
            date: initialData ? initialData.date : new Date().toISOString(),
        };

        try {
            const url = initialData ? `/api/expenses/${initialData.id}` : '/api/expenses';
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(`Failed to ${initialData ? 'update' : 'record'} expense`);
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
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                <input
                    name="description"
                    required
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                    placeholder="e.g. Electricity Bill, Shop Rent"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                    <select
                        name="category"
                        required
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Supplies">Supplies</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent">Rent</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Amount (₦)</label>
                    <input
                        name="amount"
                        type="number"
                        required
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
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
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : initialData ? 'Update Expense' : 'Record Expense'}
                </button>
            </div>
        </form>
    );
}
