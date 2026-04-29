'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Smartphone, 
  TrendingUp, 
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, maskIMEI } from '@/lib/utils';
import type { Product, Transaction, User } from '@/types';
import Link from 'next/link';

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [recentSales, setRecentSales] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalCommission: 0,
    activeUnits: 0,
    totalSold: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get profile
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
      setUserProfile(profile);

      // 2. Get active products (assigned to me)
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('status', 'assigned');

      // 3. Get my sales
      const { data: sales } = await supabase
        .from('transactions')
        .select(`
          *,
          product:products(*)
        `)
        .eq('staff_id', user.id)
        .order('sold_at', { ascending: false });

      if (products && sales) {
        const totalComm = sales.reduce((acc, curr) => acc + Number(curr.commission_amount), 0);
        setStats({
          totalCommission: totalComm,
          activeUnits: products.length,
          totalSold: sales.length
        });
        setMyProducts(products as any);
        setRecentSales(sales.slice(0, 5) as any);
      }
    } catch (error) {
      console.error('Error fetching staff dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Halo, <span className="gradient-text">{userProfile?.name}</span> 🚀
          </h1>
          <p className="text-[var(--muted)] mt-1">Siap jualan hari ini? Semangat mengejar target komisi!</p>
        </div>
        
        <Link 
          href="/staff/jual"
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-bold shadow-lg shadow-indigo-500/30"
        >
          <ShoppingCart size={20} />
          <span>Catat Penjualan</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Komisi Saya</span>
          </div>
          <h2 className="text-3xl font-bold">{formatRupiah(stats.totalCommission)}</h2>
          <p className="text-[10px] text-green-400 mt-2 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> Real-time earnings
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Smartphone size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Unit Dipegang</span>
          </div>
          <h2 className="text-3xl font-bold">{stats.activeUnits} <span className="text-sm font-normal text-[var(--muted)]">Unit</span></h2>
          <p className="text-[10px] text-[var(--muted)] mt-2 font-bold uppercase tracking-widest">Siap dijual</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Package size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Total Terjual</span>
          </div>
          <h2 className="text-3xl font-bold">{stats.totalSold} <span className="text-sm font-normal text-[var(--muted)]">Unit</span></h2>
          <p className="text-[10px] text-[var(--muted)] mt-2 font-bold uppercase tracking-widest">Performa terbaik</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Inventory List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Smartphone size={20} className="text-indigo-400" />
              Stok <span className="gradient-text">Saya</span>
            </h3>
            <Link href="/staff/gudang" className="text-xs text-indigo-400 font-bold hover:underline">
              Ambil Stok Lagi &rarr;
            </Link>
          </div>
          
          <div className="space-y-3">
            {myProducts.length === 0 ? (
              <div className="glass-card p-12 text-center text-[var(--muted)] text-sm">
                Belum ada unit yang kamu pegang.
              </div>
            ) : (
              myProducts.map((p) => (
                <div key={p.id} className="glass-card p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                      {p.photo_url ? (
                        <img src={p.photo_url} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone size={20} className="text-white/10" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.model}</h4>
                      <p className="text-[10px] text-[var(--muted)] font-bold">{p.color} • {p.storage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-400">{formatRupiah(p.selling_price)}</p>
                    <p className="text-[10px] text-[var(--muted)] font-mono">{maskIMEI(p.imei)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-amber-400" />
              Penjualan <span className="gradient-text">Terakhir</span>
            </h3>
            <Link href="/staff/komisi" className="text-xs text-indigo-400 font-bold hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <div className="glass-card p-12 text-center text-[var(--muted)] text-sm">
                Belum ada penjualan tercatat.
              </div>
            ) : (
              recentSales.map((t) => (
                <div key={t.id} className="glass-card p-4 flex items-center justify-between border-l-4 border-l-green-500">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{(t as any).product?.model}</h4>
                      <p className="text-[10px] text-[var(--muted)]">
                        {new Date(t.sold_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • Customer: {t.buyer_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">+{formatRupiah(t.commission_amount)}</p>
                    <p className="text-[10px] text-[var(--muted)] uppercase font-bold">{t.payment_method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
