"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DebtFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function DebtForm({ onSuccess, onCancel }: DebtFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        amount: '',
        description: '',
        dueDate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/debts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount),
                }),
            });

            if (!res.ok) throw new Error('Failed to record debt');
            onSuccess();
        } catch (error) {
            console.error('Record debt error:', error);
            alert("Failed to record debt");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Customer Name</label>
                    <input
                        required
                        type="text"
                        className="w-full mt-1 px-4 py-3 bg-muted/20 border border-border rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-sm"
                        placeholder="Who is owing?"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Amount Owed</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full mt-1 px-4 py-3 bg-muted/20 border border-border rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-sm"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description / Items</label>
                    <textarea
                        required
                        className="w-full mt-1 px-4 py-3 bg-muted/20 border border-border rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-sm"
                        placeholder="What was bought on credit?"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Payment Due Date</label>
                    <input
                        required
                        type="date"
                        className="w-full mt-1 px-4 py-3 bg-muted/20 border border-border rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-sm"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 px-6 border border-border rounded-2xl text-xs font-black hover:bg-muted transition-colors uppercase tracking-widest"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 py-4 px-6 bg-primary text-primary-foreground rounded-2xl text-xs font-black hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-primary/30 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Record Debt'}
                </button>
            </div>
        </form>
    );
}
