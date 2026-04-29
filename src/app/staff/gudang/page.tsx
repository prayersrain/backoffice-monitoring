'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Smartphone, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';
import type { Product, StockRequest } from '@/types';

export default function StaffGudangPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch products in warehouse
    const { data: pData } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'warehouse')
      .order('created_at', { ascending: false });

    // Fetch my pending requests
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: rData } = await supabase
        .from('stock_requests')
        .select('*')
        .eq('staff_id', user.id)
        .order('created_at', { ascending: false });
      
      if (rData) setRequests(rData as any);
    }

    if (pData) setProducts(pData as any);
    setLoading(false);
  };

  const handleRequestProduct = async (product: Product) => {
    setRequestingId(product.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Create request
      const { error } = await supabase.from('stock_requests').insert({
        staff_id: user.id,
        product_id: product.id,
        status: 'pending'
      });

      if (error) throw error;

      alert('Permintaan stok berhasil dikirim! Menunggu approval Owner.');
      fetchData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setRequestingId(null);
    }
  };

  const getRequestStatus = (productId: string) => {
    const req = requests.find(r => r.product_id === productId && r.status === 'pending');
    return req ? 'pending' : null;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Stok <span className="gradient-text">Gudang</span>
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Pilih produk yang ingin kamu jual dan tunggu persetujuan Honda (Owner).
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
        <input 
          type="text"
          placeholder="Cari model, warna, atau spesifikasi..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-all text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Warehouse Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-4 h-[200px] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <Package size={48} className="mx-auto text-[var(--muted)]" />
          <p className="text-[var(--muted)]">Gudang sedang kosong. Hubungi Owner untuk stok baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products
            .filter(p => p.model.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((product) => {
              const isPending = getRequestStatus(product.id);
              return (
                <div key={product.id} className="glass-card p-4 flex flex-col justify-between group">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                      {product.photo_url ? (
                        <img src={product.photo_url} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone className="text-white/10" size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white line-clamp-1">{product.model}</h3>
                      <p className="text-xs text-[var(--muted)]">{product.color} • {product.storage}</p>
                      <p className="text-sm font-bold text-indigo-400 mt-1">{formatRupiah(product.selling_price)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Komisi: {formatRupiah(product.commission_amount)}</div>
                    
                    {isPending ? (
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                        <Clock size={14} /> Menunggu Approval
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRequestProduct(product)}
                        disabled={requestingId === product.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-bold disabled:opacity-50"
                      >
                        {requestingId === product.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <PlusCircle size={14} />
                        )}
                        Ambil Stok
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* My Recent Requests (Footer Section) */}
      {requests.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock size={20} className="text-indigo-400" />
            Riwayat <span className="gradient-text">Permintaan Saya</span>
          </h2>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[var(--muted)] text-[10px] uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{(req as any).product_id}</td>
                      <td className="px-6 py-4 text-[var(--muted)]">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">
                        {req.status === 'pending' && <span className="text-amber-400 flex items-center gap-1"><Clock size={14} /> Menunggu</span>}
                        {req.status === 'approved' && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={14} /> Disetujui</span>}
                        {req.status === 'rejected' && <span className="text-red-400 flex items-center gap-1"><XCircle size={14} /> Ditolak</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
