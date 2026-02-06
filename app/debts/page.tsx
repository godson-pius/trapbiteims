"use client";

import { useState, useEffect } from 'react';
import { HandCoins, Plus, Search, Calendar, Loader2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Debt } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/Modal';
import DebtForm from '@/components/DebtForm';

export default function DebtsPage() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);

    useEffect(() => {
        fetchDebts();
    }, []);

    const fetchDebts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/debts');
            const data = await res.json();
            setDebts(data);
        } catch (error) {
            console.error('Failed to fetch debts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Pending' ? 'Paid' : 'Pending';
        try {
            const res = await fetch(`/api/debts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            fetchDebts();
        } catch (error) {
            console.error('Update status error:', error);
            alert("Failed to update payment status");
        }
    };

    const handleDeleteDebt = async (id: string) => {
        if (!confirm("Are you sure you want to delete this debt record?")) return;

        try {
            const res = await fetch(`/api/debts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete debt');
            fetchDebts();
        } catch (error) {
            console.error('Delete error:', error);
            alert("Failed to delete debt record");
        }
    };

    const filteredDebts = debts.filter(d => {
        const matchesSearch = d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !filterDate || new Date(d.date).toISOString().split('T')[0] === filterDate;

        return matchesSearch && matchesDate;
    });

    const columns: Column<Debt>[] = [
        {
            header: 'Customer',
            accessorKey: (d: Debt) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{d.customerName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black truncate max-w-[200px]">{d.description}</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: (d: Debt) => (
                <span className="font-black text-foreground">{formatCurrency(d.amount)}</span>
            )
        },
        {
            header: 'Due Date',
            accessorKey: (d: Debt) => (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                        {new Date(d.dueDate).toLocaleDateString()}
                    </span>
                    {d.status === 'Pending' && new Date(d.dueDate) < new Date() && (
                        <span className="bg-red-100 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Overdue</span>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: (d: Debt) => (
                <button
                    onClick={() => handleToggleStatus(d.id, d.status)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${d.status === 'Paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                >
                    {d.status === 'Paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {d.status}
                </button>
            )
        },
        {
            header: 'Actions',
            accessorKey: (d: Debt) => (
                <button
                    onClick={() => handleDeleteDebt(d.id)}
                    className="p-2 hover:bg-red-50 rounded-xl text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    const totalOwed = debts.filter(d => d.status === 'Pending').reduce((acc, d) => acc + d.amount, 0);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Debts</h1>
                    <p className="text-muted-foreground font-medium text-sm">People owing the business.</p>
                </div>
                <button
                    onClick={() => setIsDebtModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white rounded-2xl text-sm font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                >
                    <Plus size={20} />
                    New Debt
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-orange-50 border-2 border-orange-100 p-6 md:p-8 rounded-4xl">
                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-2">Total Owed to Trapbite</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl md:text-4xl font-black text-orange-600">{formatCurrency(totalOwed)}</h3>
                        <span className="text-orange-400 text-[10px] font-black uppercase">Pending Payment</span>
                    </div>
                </div>
                <div className="bg-white border-2 border-border p-6 md:p-8 rounded-4xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Pending Debts</p>
                        <h3 className="text-xl md:text-2xl font-black text-foreground">
                            {debts.filter(d => d.status === 'Pending').length} Records
                        </h3>
                    </div>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground border border-border">
                        <HandCoins size={28} />
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
                                placeholder="Search debtors..."
                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-orange-500/20 outline-none transition-all font-bold text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 sm:max-w-[200px]">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="date"
                                className="w-full pl-10 pr-10 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-orange-500/20 outline-none transition-all font-bold text-xs appearance-none"
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
                </div>

                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 bg-orange-50/10 rounded-2xl border-2 border-dashed border-orange-100">
                        <Loader2 className="animate-spin text-orange-500" size={32} />
                        <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase text-orange-800/60">Fetching Debts...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-white">
                        <DataTable columns={columns} data={filteredDebts} />
                    </div>
                )}
            </div>

            <Modal
                isOpen={isDebtModalOpen}
                onClose={() => setIsDebtModalOpen(false)}
                title="RECORD NEW DEBT"
            >
                <DebtForm
                    onSuccess={() => {
                        setIsDebtModalOpen(false);
                        fetchDebts();
                    }}
                    onCancel={() => setIsDebtModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
