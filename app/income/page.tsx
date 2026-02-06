"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react';
import { Sale, Expense } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function IncomePage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [saleRes, expRes] = await Promise.all([
                    fetch('/api/sales'),
                    fetch('/api/expenses')
                ]);

                const [saleData, expData] = await Promise.all([
                    saleRes.json(),
                    expRes.json()
                ]);

                setSales(saleData);
                setExpenses(expData);
            } catch (error) {
                console.error('Failed to fetch income data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalSales - totalExpenses;

    const dummyData = [
        { name: 'Jan', income: 4000, expenses: 2400 },
        { name: 'Feb', income: 3800, expenses: 1398 },
        { name: 'Mar', income: 5200, expenses: 3200 },
        { name: 'Apr', income: 4780, expenses: 2908 },
        { name: 'May', income: 6890, expenses: 4800 },
        { name: 'Jun', income: 2390, expenses: 3800 },
        { name: 'Jul', income: totalSales, expenses: totalExpenses },
    ];

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-muted-foreground font-medium">Analyzing your income...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Income Analysis</h1>
                    <p className="text-muted-foreground">Compare your earnings against expenditures.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-green-500 to-green-600 p-8 rounded-3xl text-white shadow-xl shadow-green-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80">Gross Income</p>
                        <div className="p-2 bg-white/20 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black">{formatCurrency(totalSales)}</h3>
                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1 font-bold">
                        <ArrowUpRight size={14} />
                        Total revenue to date
                    </p>
                </div>

                <div className="bg-linear-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl shadow-orange-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80">Net Profit</p>
                        <div className="p-2 bg-white/20 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black">{formatCurrency(netProfit)}</h3>
                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1 font-bold">
                        <ArrowUpRight size={14} />
                        Profit Margin: {totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0}%
                    </p>
                </div>

                <div className="bg-white border border-border p-8 rounded-3xl shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Tax Owed (Est.)</p>
                    <h3 className="text-3xl font-black text-foreground">{formatCurrency(totalSales * 0.05)}</h3>
                    <p className="text-xs text-muted-foreground mt-2">Based on 5% flat rate</p>
                </div>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-8">Income vs Expenses Trend</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dummyData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e1d8" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7d6b5e', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7d6b5e', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: '1px solid #e9e1d8', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                            <Area type="monotone" dataKey="expenses" stroke="#f97316" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
