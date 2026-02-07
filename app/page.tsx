"use client";

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Wallet,
  Loader2,
  Plus
} from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Product, Sale, Expense } from '@/lib/data';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import Modal from '@/components/Modal';
import SaleForm from '@/components/SaleForm';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, saleRes, expRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/sales'),
        fetch('/api/expenses')
      ]);

      const [prodData, saleData, expData] = await Promise.all([
        prodRes.json(),
        saleRes.json(),
        expRes.json()
      ]);

      setProducts(prodData);
      setSales(saleData);
      setExpenses(expData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSalesValue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalExpensesValue = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const stockCount = products.reduce((acc, prod) => acc + prod.stock, 0);
  const netIncome = totalSalesValue - totalExpensesValue;

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: totalSalesValue > 0 ? totalSalesValue / 10 : 0 },
  ];

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium">Updating your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at Trapbite today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Download Report
          </button>
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Quick Sale
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(totalSalesValue)}
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Stock Level"
          value={`${stockCount} units`}
          icon={Package}
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpensesValue)}
          icon={Wallet}
        />
        <StatsCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          className="bg-primary/5 border-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-4 md:p-6 rounded-3xl border border-border shadow-sm">
          <h3 className="font-bold text-lg mb-6">Weekly Performance</h3>
          <div className="h-[250px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e1d8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7d6b5e', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7d6b5e', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(240, 90, 40, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e9e1d8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#f05a28' : '#fef3e2'} stroke={index === chartData.length - 1 ? '#f05a28' : '#e9e1d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="font-bold text-lg mb-6">Recent Sales</h3>
          <div className="space-y-6">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                    {sale.productName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(sale.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">+{formatCurrency(sale.total)}</p>
                  <p className="text-[10px] text-muted-foreground">{sale.quantity} units</p>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-center text-muted-foreground py-10 italic">No sales recorded yet.</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors border border-dashed border-primary/30">
            View All Sales
          </button>
        </div>
      </div>

      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="QUICK SALE REGISTRATION"
      >
        <SaleForm
          onSuccess={() => {
            setIsSaleModalOpen(false);
            fetchData();
          }}
          onCancel={() => setIsSaleModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
