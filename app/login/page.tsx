"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

                    <div className="relative flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                            <Store size={32} strokeWidth={2.5} />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome Back</h1>
                            <p className="text-muted-foreground font-medium">Log in to manage your Trapbite business.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        placeholder="[EMAIL_ADDRESS]"
                                        className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-sm placeholder:text-muted-foreground/40"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Security Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-muted/50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-sm placeholder:text-muted-foreground/40"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-wider border border-red-100 flex items-center gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-[1.25rem] text-sm font-black hover:opacity-90 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>SECURE LOGIN</>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    Trusted by Trapbite Business Management
                </p>
            </motion.div>
        </div>
    );
}
