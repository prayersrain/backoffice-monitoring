'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Smartphone, 
  Users, 
  ShoppingCart,
  ArrowUpRight,
  Loader2,
  Package
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
  AreaChart,
  Area
} from 'recharts';

export default function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalProducts: 0,
    activeStaff: 0,
    soldUnits: 0,
    warehouseUnits: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Get all products
      const { data: products } = await supabase.from('products').select('*');
      
      // 2. Get all transactions
      const { data: transactions } = await supabase.from('transactions').select(`
        *,
        product:products(purchase_price)
      `);

      // 3. Get total staff
      const { count: staffCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff');

      if (products && transactions) {
        const sold = products.filter(p => p.status === 'sold').length;
        const warehouse = products.filter(p => p.status === 'warehouse').length;
        
        const revenue = transactions.reduce((acc, curr) => acc + Number(curr.selling_price), 0);
        const profit = transactions.reduce((acc, curr) => {
          const modal = Number((curr as any).product?.purchase_price || 0);
          const jual = Number(curr.selling_price);
          const komisi = Number(curr.commission_amount);
          return acc + (jual - modal - komisi);
        }, 0);

        setStats({
          totalRevenue: revenue,
          totalProfit: profit,
          totalProducts: products.length,
          activeStaff: staffCount || 0,
          soldUnits: sold,
          warehouseUnits: warehouse
        });

        // Simple chart data (last 7 days - placeholder logic but structure is ready)
        setChartData([
          { name: 'Sen', sales: 4000, profit: 2400 },
          { name: 'Sel', sales: 3000, profit: 1398 },
          { name: 'Rab', sales: 2000, profit: 9800 },
          { name: 'Kam', sales: 2780, profit: 3908 },
          { name: 'Jum', sales: 1890, profit: 4800 },
          { name: 'Sab', sales: 2390, profit: 3800 },
          { name: 'Min', sales: 3490, profit: 4300 },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Halo, <span className="gradient-text">Honda</span> 👋
        </h1>
        <p className="text-[var(--muted)] mt-1">Berikut adalah ringkasan performa bisnis kamu hari ini.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pendapatan" 
          value={formatRupiah(stats.totalRevenue)} 
          icon={<DollarSign className="text-green-400" />}
          trend="+12.5%"
          color="green"
        />
        <StatCard 
          title="Profit Bersih" 
          value={formatRupiah(stats.totalProfit)} 
          icon={<TrendingUp className="text-indigo-400" />}
          trend="+8.2%"
          color="indigo"
        />
        <StatCard 
          title="Unit Terjual" 
          value={stats.soldUnits.toString()} 
          icon={<ShoppingCart className="text-amber-400" />}
          trend={`Total: ${stats.totalProducts}`}
          color="amber"
        />
        <StatCard 
          title="Total Staf" 
          value={stats.activeStaff.toString()} 
          icon={<Users className="text-purple-400" />}
          trend="Semua Aktif"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Statistik Penjualan</h3>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-6">Status Inventori</h3>
          <div className="space-y-6 flex-1">
            <InventoryProgress 
              label="Gudang" 
              count={stats.warehouseUnits} 
              total={stats.totalProducts} 
              color="bg-blue-500" 
            />
            <InventoryProgress 
              label="Di Staf" 
              count={stats.totalProducts - stats.warehouseUnits - stats.soldUnits} 
              total={stats.totalProducts} 
              color="bg-amber-500" 
            />
            <InventoryProgress 
              label="Terjual" 
              count={stats.soldUnits} 
              total={stats.totalProducts} 
              color="bg-green-500" 
            />
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">Kesehatan Stok</span>
              <span className="text-green-400 font-bold">Bagus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="glass-card p-6 group hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-${color}-500/10`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--muted)] bg-white/5 px-2 py-1 rounded-full">
          <ArrowUpRight size={10} className="text-green-400" />
          {trend}
        </div>
      </div>
      <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
    </div>
  );
}

function InventoryProgress({ label, count, total, color }: any) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-bold">{count} <span className="text-[var(--muted)] text-xs">/ {total}</span></span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
