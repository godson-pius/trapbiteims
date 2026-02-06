"use client";

import { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, Loader2, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Product } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import Modal from '@/components/Modal';
import ProductForm from '@/components/ProductForm';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (error) {
            console.error('Delete error:', error);
            alert("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const lowStockItems = products.filter(p => p.stock < 10);

    const columns: Column<Product>[] = [
        {
            header: 'Product Name',
            accessorKey: (p: Product) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                        {p.name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{p.category}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Price',
            accessorKey: (p: Product) => (
                <span className="font-bold text-primary">{formatCurrency(p.price)}</span>
            )
        },
        {
            header: 'Stock Status',
            accessorKey: (p: Product) => (
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 w-20 bg-muted rounded-full overflow-hidden shadow-inner hidden md:block">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                p.stock > 20 ? "bg-green-500" : p.stock > 10 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"
                            )}
                            style={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-sm font-black",
                            p.stock < 10 ? "text-red-600" : "text-foreground"
                        )}>
                            {p.stock} {p.unit}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Available</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: (p: Product) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleEditProduct(p)}
                        className="p-2.5 hover:bg-secondary rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-90"
                        title="Edit Product"
                    >
                        <Edit2 size={18} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2.5 hover:bg-red-50 rounded-xl text-muted-foreground hover:text-red-500 transition-all active:scale-90"
                        title="Delete Product"
                    >
                        <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Inventory</h1>
                    <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Supply management for Trapbite.
                    </p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-primary/30 active:scale-95 group"
                >
                    <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    REGISTER PRODUCT
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white border border-border p-5 rounded-3xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                        <Package size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Variations</p>
                        <h3 className="text-xl font-black">{products.length}</h3>
                    </div>
                </div>

                <div className={cn(
                    "sm:col-span-2 border p-5 rounded-3xl shadow-sm flex items-center gap-4 md:gap-6 transition-colors",
                    lowStockItems.length > 0 ? "bg-red-50 border-red-100" : "bg-white border-border opacity-50"
                )}>
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        lowStockItems.length > 0 ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                    )}>
                        <AlertTriangle size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest truncate",
                            lowStockItems.length > 0 ? "text-red-800" : "text-muted-foreground"
                        )}>Stock Warning</p>
                        <h3 className={cn(
                            "text-lg font-black truncate",
                            lowStockItems.length > 0 ? "text-red-600" : "text-muted-foreground"
                        )}>
                            {lowStockItems.length} Running Low
                        </h3>
                    </div>
                </div>

                <div className="bg-primary p-5 rounded-3xl shadow-xl shadow-primary/20 flex items-center gap-4 text-primary-foreground overflow-hidden relative">
                    <div className="absolute -right-2 -top-2 opacity-10 rotate-12">
                        <TrendingUp size={80} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black opacity-80 uppercase tracking-widest">Stock Value</p>
                        <h3 className="text-xl font-black truncate">
                            {formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock), 0))}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-4xl border border-border shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between relative z-10">
                    <div className="relative w-full sm:w-[24rem] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder="Find products..."
                            className="w-full pl-11 pr-4 py-3 bg-muted/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white outline-none transition-all font-bold placeholder:text-muted-foreground/50 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-border rounded-xl text-xs font-black hover:border-primary/30 text-muted-foreground active:scale-95 uppercase tracking-wider">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {isLoading ? (
                    <div className="h-120 flex flex-col items-center justify-center gap-6 bg-muted/5 rounded-4xl border-2 border-dashed border-border/50">
                        <div className="relative">
                            <Loader2 className="animate-spin text-primary" size={64} strokeWidth={3} />
                            <div className="absolute inset-0 blur-[32px] bg-primary/30 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-foreground font-black tracking-widest uppercase text-lg">Syncing Database</p>
                            <p className="text-muted-foreground text-sm font-bold uppercase pb-10 tracking-widest">Please Wait...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-white/40 shadow-inner">
                        <DataTable columns={columns} data={filteredProducts} />
                    </div>
                )}
            </div>

            <Modal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title={editingProduct ? 'UPDATE PRODUCT LOG' : 'NEW PRODUCT REGISTRATION'}
            >
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={() => {
                            setIsProductModalOpen(false);
                            fetchProducts();
                        }}
                        onCancel={() => setIsProductModalOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
}

// Support small component
function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
