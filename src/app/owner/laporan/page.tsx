'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Users, 
  Calendar,
  Download,
  Filter,
  Loader2,
  DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function OwnerLaporanPage() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [modelData, setModelData] = useState<any[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
    revenue: 0,
    profit: 0,
    avgCommission: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchLaporanData();
  }, []);

  const fetchLaporanData = async () => {
    setLoading(true);
    try {
      // 1. Get transactions with product details
      const { data: transactions } = await supabase
        .from('transactions')
        .select(`
          *,
          product:products(model, purchase_price),
          staff:users!transactions_staff_id_fkey(name)
        `)
        .order('sold_at', { ascending: true });

      if (transactions) {
        // Process stats
        let rev = 0;
        let prof = 0;
        let totalComm = 0;

        // Process Model Popularity
        const models: any = {};
        // Process Staff Performance
        const staff: any = {};
        // Process Daily Sales
        const daily: any = {};

        transactions.forEach(t => {
          const modal = Number((t as any).product?.purchase_price || 0);
          const jual = Number(t.selling_price);
          const komisi = Number(t.commission_amount);
          const p = jual - modal - komisi;
          
          rev += jual;
          prof += p;
          totalComm += komisi;

          // Model count
          const modelName = (t as any).product?.model || 'Unknown';
          models[modelName] = (models[modelName] || 0) + 1;

          // Staff performance
          const staffName = (t as any).staff?.name || 'Unknown';
          if (!staff[staffName]) staff[staffName] = { name: staffName, sales: 0, profit: 0 };
          staff[staffName].sales += jual;
          staff[staffName].profit += p;

          // Daily data
          const date = new Date(t.sold_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
          if (!daily[date]) daily[date] = { name: date, revenue: 0, profit: 0 };
          daily[date].revenue += jual;
          daily[date].profit += p;
        });

        setTotalStats({
          revenue: rev,
          profit: prof,
          avgCommission: transactions.length > 0 ? totalComm / transactions.length : 0
        });

        setSalesData(Object.values(daily));
        setModelData(Object.entries(models).map(([name, value]) => ({ name, value })));
        setStaffPerformance(Object.values(staff));
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

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
          <h1 className="text-2xl font-bold">
            Laporan <span className="gradient-text">Analitik</span>
          </h1>
          <p className="text-[var(--muted)] mt-1">Data penjualan dan performa tim secara mendalam.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
            <Filter size={14} />
            Filter Periode
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Download size={14} />
            Export PDF/Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">Revenue Bersih</p>
              <h2 className="text-3xl font-bold text-white leading-none">{formatRupiah(totalStats.revenue)}</h2>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
            <span className="text-[var(--muted)]">Total Profit Honda</span>
            <span className="text-green-400 font-bold">+{formatRupiah(totalStats.profit)}</span>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">Rata-rata Margin</p>
              <h2 className="text-3xl font-bold text-white leading-none">
                {totalStats.revenue > 0 ? ((totalStats.profit / totalStats.revenue) * 100).toFixed(1) : 0}%
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
            <span className="text-[var(--muted)]">Efisiensi Bisnis</span>
            <span className="text-amber-400 font-bold">Sangat Sehat</span>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-green-500/20 text-green-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">Rata-rata Komisi</p>
              <h2 className="text-3xl font-bold text-white leading-none">{formatRupiah(totalStats.avgCommission)}</h2>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
            <span className="text-[var(--muted)]">Per Unit</span>
            <span className="text-green-400 font-bold">Incentivized</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Performance Chart */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-400" />
            Trend Penjualan & Profit
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit Honda" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-purple-400" />
            Model Terpopuler
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Performance Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Users size={20} className="text-indigo-400" />
              Performa Tim Staf
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[var(--muted)] text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-4">Nama Staf</th>
                  <th className="px-8 py-4">Total Sales</th>
                  <th className="px-8 py-4">Kontribusi Profit</th>
                  <th className="px-8 py-4">Progress Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffPerformance.map((s, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-white">{formatRupiah(s.sales)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-green-400 font-bold">
                        <TrendingUp size={14} />
                        {formatRupiah(s.profit)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[100px]">
                          <div className="h-full bg-indigo-500" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--muted)]">75%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
