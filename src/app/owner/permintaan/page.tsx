'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone, 
  User, 
  Loader2,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';
import type { StockRequest } from '@/types';

export default function OwnerPermintaanPage() {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stock_requests')
      .select(`
        *,
        product:products(*),
        staff:users!stock_requests_staff_id_fkey(name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as any);
    }
    setLoading(false);
  };

  const handleAction = async (id: string, productId: string, staffId: string, action: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      // 1. Update request status
      const { error: reqError } = await supabase
        .from('stock_requests')
        .update({ status: action })
        .eq('id', id);

      if (reqError) throw reqError;

      // 2. If approved, update product status and assignment
      if (action === 'approved') {
        const { error: prodError } = await supabase
          .from('products')
          .update({ 
            status: 'assigned',
            assigned_to: staffId,
            assigned_at: new Date().toISOString()
          })
          .eq('id', productId);
        
        if (prodError) throw prodError;
      }

      alert(`Permintaan berhasil ${action === 'approved' ? 'disetujui' : 'ditolak'}.`);
      fetchRequests();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Permintaan</span> Stok
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Review dan approve permintaan pengambilan unit iPhone dari staf.
        </p>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <PackageCheck size={48} className="mx-auto text-[var(--muted)] opacity-20" />
          <div>
            <h3 className="text-lg font-bold">Tidak Ada Permintaan</h3>
            <p className="text-sm text-[var(--muted)]">Semua permintaan stok sudah diproses.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-amber-500">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Staff Info */}
                <div className="flex items-center gap-3 md:w-48">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Dari Staf</p>
                    <p className="font-bold text-white leading-tight">{(req as any).staff?.name}</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                    {(req as any).product?.photo_url ? (
                      <img src={(req as any).product.photo_url} className="w-full h-full object-cover" />
                    ) : (
                      <Smartphone size={24} className="text-white/10" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Unit Produk</p>
                    <p className="font-bold text-white">{(req as any).product?.model}</p>
                    <p className="text-xs text-[var(--muted)]">{(req as any).product?.color} • {(req as any).product?.storage}</p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] bg-white/5 px-3 py-1.5 rounded-full">
                  <Clock size={14} />
                  <span>{new Date(req.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAction(req.id, req.product_id, req.staff_id, 'rejected')}
                  disabled={actionLoading === req.id}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Reject
                </button>
                <button 
                  onClick={() => handleAction(req.id, req.product_id, req.staff_id, 'approved')}
                  disabled={actionLoading === req.id}
                  className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                >
                  {actionLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="glass-card p-6 bg-indigo-500/5 border-indigo-500/10 flex gap-4">
        <AlertCircle className="text-indigo-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-sm text-white">Catatan Serah Terima</h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Menyetujui permintaan stok berarti unit tersebut resmi berpindah tanggung jawab ke tangan staf yang bersangkutan. 
            Pastikan unit sudah diserahkan secara fisik.
          </p>
        </div>
      </div>
    </div>
  );
}
