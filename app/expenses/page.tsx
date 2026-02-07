"use client";

import { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Filter, Loader2, Edit2, Trash2, X, Calendar } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Expense } from '@/lib/data';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import Modal from '@/components/Modal';
import ExpenseForm from '@/components/ExpenseForm';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/expenses');
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense record?")) return;

        try {
            const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete expense');
            fetchExpenses();
        } catch (error) {
            console.error('Delete error:', error);
            alert("Failed to delete expense record");
        }
    };

    const filteredExpenses = expenses.filter(e => {
        const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !filterDate || new Date(e.date).toISOString().split('T')[0] === filterDate;

        return matchesSearch && matchesDate;
    });

    const columns: Column<Expense>[] = [
        // ... (lines omitted for brevity, will be handled by replace_file_content)
        {
            header: 'Description',
            accessorKey: (e: Expense) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{e.description}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black">{e.category}</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: (e: Expense) => (
                <span className="text-red-500 font-black">{formatCurrency(e.amount)}</span>
            )
        },
        {
            header: 'Date',
            accessorKey: (e: Expense) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{formatDateTime(e.date)}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: (e: Expense) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            setEditingExpense(e);
                            setIsExpenseModalOpen(true);
                        }}
                        className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-primary transition-colors"
                        title="Edit Record"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteExpense(e.id)}
                        className="p-2 hover:bg-red-50 rounded-xl text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete Record"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Expenses</h1>
                    <p className="text-muted-foreground font-medium text-sm">Business cost tracking.</p>
                </div>
                <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                    <Plus size={20} />
                    Record Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-red-50 border-2 border-red-100 p-6 md:p-8 rounded-4xl">
                    <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-2">Total Expenditures</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl md:text-4xl font-black text-red-600">{formatCurrency(totalExpenses)}</h3>
                        <span className="text-red-400 text-[10px] font-black uppercase">Cumulative</span>
                    </div>
                </div>
                <div className="bg-white border-2 border-border p-6 md:p-8 rounded-4xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Largest Category</p>
                        <h3 className="text-xl md:text-2xl font-black text-foreground">
                            {expenses.length > 0 ? expenses[0].category : 'N/A'}
                        </h3>
                    </div>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground border border-border">
                        <Receipt size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-4xl border border-border shadow-xl space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                        <div className="relative flex-1 sm:max-w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-red-500/20 outline-none transition-all font-bold text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 sm:max-w-[200px]">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="date"
                                className="w-full pl-10 pr-10 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-red-500/20 outline-none transition-all font-bold text-xs appearance-none"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border rounded-xl text-xs font-bold hover:bg-muted transition-colors text-muted-foreground uppercase">
                        <Filter size={18} />
                        Categories
                    </button>
                </div>

                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 bg-red-50/10 rounded-2xl border-2 border-dashed border-red-100">
                        <Loader2 className="animate-spin text-red-500" size={32} />
                        <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase text-red-800/60">Fetching Records...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-white">
                        <DataTable columns={columns} data={filteredExpenses} />
                    </div>
                )}
            </div>

            <Modal
                isOpen={isExpenseModalOpen}
                onClose={() => {
                    setIsExpenseModalOpen(false);
                    setEditingExpense(undefined);
                }}
                title={editingExpense ? "EDIT EXPENSE RECORD" : "REGISTER BUSINESS EXPENSE"}
            >
                <ExpenseForm
                    initialData={editingExpense}
                    onSuccess={() => {
                        setIsExpenseModalOpen(false);
                        setEditingExpense(undefined);
                        fetchExpenses();
                    }}
                    onCancel={() => {
                        setIsExpenseModalOpen(false);
                        setEditingExpense(undefined);
                    }}
                />
            </Modal>
        </div>
    );
}
