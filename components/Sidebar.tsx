"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    TrendingUp,
    Receipt,
    Settings,
    Store,
    X,
    HandCoins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: ShoppingCart, label: 'Sales', href: '/sales' },
    { icon: Receipt, label: 'Expenses', href: '/expenses' },
    { icon: HandCoins, label: 'Debts', href: '/debts' },
    { icon: TrendingUp, label: 'Income', href: '/income' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const SidebarContent = (
        <div className="flex flex-col h-full w-64 bg-card border-r border-border shadow-2xl lg:shadow-none">
            <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                        <Store size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Trapbite</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">IMS</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose()}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="p-4 bg-secondary/50 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Business Info</p>
                    <div className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                        <p>No 4. Moore house ogui road, Enugu</p>
                        <p className="font-bold text-foreground">Tel: 08025406518</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all font-bold text-sm">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 h-full"
                        >
                            {SidebarContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
