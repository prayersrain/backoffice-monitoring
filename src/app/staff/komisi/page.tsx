'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  History, 
  Smartphone, 
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, maskIMEI } from '@/lib/utils';
import type { Transaction } from '@/types';

export default function StaffKomisiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCommission: 0,
    totalSales: 0,
    thisMonth: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          product:products(model, color, storage, imei)
        `)
        .eq('staff_id', user.id)
        .order('sold_at', { ascending: false });

      if (data) {
        setTransactions(data as any);
        
        // Calculate stats
        const total = data.reduce((acc, curr) => acc + Number(curr.commission_amount), 0);
        const thisMonth = data
          .filter(t => new Date(t.sold_at).getMonth() === new Date().getMonth())
          .reduce((acc, curr) => acc + Number(curr.commission_amount), 0);
        
        setStats({
          totalCommission: total,
          totalSales: data.length,
          thisMonth: thisMonth
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Komisi <span className="gradient-text">Saya</span>
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Pantau pendapatan dan riwayat penjualan kamu di sini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 bg-gradient-to-br from-green-500/10 to-indigo-500/10 border-green-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Total Komisi</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{formatRupiah(stats.totalCommission)}</h2>
          <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1 font-bold">
            <TrendingUp size={12} /> Dari {stats.totalSales} penjualan
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Bulan Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{formatRupiah(stats.thisMonth)}</h2>
          <p className="text-[10px] text-[var(--muted)] mt-2 uppercase font-bold tracking-widest">
            Update: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="glass-card p-6 border-white/5 bg-white/2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-white/10 text-white/40">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Target Berikutnya</span>
          </div>
          <h2 className="text-3xl font-bold text-white/40">{formatRupiah(1000000)}</h2>
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
              style={{ width: `${Math.min((stats.thisMonth / 1000000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
          <History size={16} /> Riwayat Penjualan
        </h2>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-4 h-16 animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-card p-12 text-center text-[var(--muted)]">
            Belum ada riwayat penjualan. Yuk semangat jualannya!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="glass-card p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{(t as any).product?.model}</h3>
                    <p className="text-[10px] text-[var(--muted)] uppercase font-bold">
                      {new Date(t.sold_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {maskIMEI((t as any).product?.imei)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">+{formatRupiah(t.commission_amount)}</p>
                  <p className="text-[10px] text-[var(--muted)]">Terjual: {formatRupiah(t.selling_price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
