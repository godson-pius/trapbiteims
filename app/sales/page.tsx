"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Calendar, Download, Loader2, Trash2, X } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Sale } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/Modal';
import SaleForm from '@/components/SaleForm';

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/sales');
            const data = await res.json();
            setSales(data);
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSale = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sale? This will restore the product stock.")) return;

        try {
            const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete sale');
            fetchSales();
        } catch (error) {
            console.error('Delete error:', error);
            alert("Failed to delete sale record");
        }
    };

    const filteredSales = sales.filter(s => {
        const matchesSearch = s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !filterDate || new Date(s.date).toISOString().split('T')[0] === filterDate;

        return matchesSearch && matchesDate;
    });

    const columns: Column<Sale>[] = [
        { header: 'ID', accessorKey: (s: Sale) => <span className="text-xs font-mono text-muted-foreground">{s.id.slice(-6)}</span> },
        {
            header: 'Product',
            accessorKey: (s: Sale) => (
                <span className="font-semibold text-foreground">{s.productName}</span>
            )
        },
        { header: 'Qty', accessorKey: 'quantity' },
        {
            header: 'Total Amount',
            accessorKey: (s: Sale) => (
                <span className="text-primary font-black">{formatCurrency(s.total)}</span>
            )
        },
        {
            header: 'Date',
            accessorKey: (s: Sale) => new Date(s.date).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessorKey: (s: Sale) => (
                <button
                    onClick={() => handleDeleteSale(s.id)}
                    className="p-2 hover:bg-red-50 rounded-xl text-muted-foreground hover:text-red-500 transition-colors"
                    title="Delete Record"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Sales</h1>
                    <p className="text-muted-foreground font-medium text-sm">Transaction log for Trapbite.</p>
                </div>
                <button
                    onClick={() => setIsSaleModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-primary/30"
                >
                    <Plus size={20} />
                    New Sale
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-border shadow-sm">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Total Revenue</p>
                    <h3 className="text-2xl md:text-3xl font-black text-primary">{formatCurrency(totalRevenue)}</h3>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-[10px] font-black uppercase">
                        <ShoppingCart size={14} />
                        <span>{sales.length} orders</span>
                    </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Top Item</p>
                    <h3 className="text-lg md:text-xl font-bold truncate">
                        {sales.length > 0 ? sales[0].productName : 'No Sales'}
                    </h3>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center text-primary sm:col-span-2 lg:col-span-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Average</p>
                    <h3 className="text-lg md:text-xl font-black">{formatCurrency(totalRevenue / (sales.length || 1))}</h3>
                </div>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-4xl border border-border shadow-xl space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                        <div className="relative flex-1 sm:max-w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search sales..."
                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 sm:max-w-[200px]">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="date"
                                className="w-full pl-10 pr-10 py-3 bg-muted/20 border border-transparent rounded-xl focus:border-primary/20 outline-none transition-all font-bold text-xs appearance-none"
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
                    <div className="h-64 flex flex-col items-center justify-center gap-4 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase">Fetching Sales...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-white">
                        <DataTable columns={columns} data={filteredSales} />
                    </div>
                )}
            </div>

            <Modal
                isOpen={isSaleModalOpen}
                onClose={() => setIsSaleModalOpen(false)}
                title="RECORD NEW SALE"
            >
                <SaleForm
                    onSuccess={() => {
                        setIsSaleModalOpen(false);
                        fetchSales();
                    }}
                    onCancel={() => setIsSaleModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
