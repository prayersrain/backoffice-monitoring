'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Smartphone, 
  Scan, 
  MoreVertical, 
  Trash2, 
  Edit,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, maskIMEI } from '@/lib/utils';
import type { Product } from '@/types';
import BarcodeScanner from '@/components/ui/BarcodeScanner';
import AddProductForm from '@/components/owner/AddProductForm';

export default function OwnerProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'warehouse' | 'assigned' | 'sold'>('all');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [scannedImei, setScannedImei] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        assigned_user:users!products_assigned_to_fkey(name),
        creator:users!products_created_by_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProducts(data as any);
    }
    setLoading(false);
  };

  const handleScan = (imei: string) => {
    setScannedImei(imei);
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchProducts();
    setScannedImei('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'warehouse':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
            <Package size={12} /> Gudang
          </span>
        );
      case 'assigned':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
            <Clock size={12} /> Dipegang Staf
          </span>
        );
      case 'sold':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
            <CheckCircle2 size={12} /> Terjual
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Kelola <span className="gradient-text">Produk</span>
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Total {products.length} produk terdaftar di sistem.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm"
          >
            <Scan size={18} className="text-indigo-400" />
            <span>Scan Box</span>
          </button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            <span>Tambah Unit</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <input 
            type="text"
            placeholder="Cari model, IMEI, atau warna..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <select 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-all text-sm appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Semua Status</option>
            <option value="warehouse">Gudang</option>
            <option value="assigned">Dipegang Staf</option>
            <option value="sold">Terjual</option>
          </select>
        </div>
      </div>

      {/* Product Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-4 h-[280px] animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[var(--muted)]">
            <Smartphone size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Belum Ada Produk</h3>
            <p className="text-sm text-[var(--muted)]">Mulai dengan menambahkan unit iPhone pertama Anda.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products
            .filter(p => 
              p.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
              p.imei.includes(searchQuery)
            )
            .map((product) => (
            <div key={product.id} className="glass-card group overflow-hidden flex flex-col">
              {/* Product Image Placeholder/Actual */}
              <div className="aspect-square relative bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex items-center justify-center overflow-hidden">
                {product.photo_url ? (
                  <img 
                    src={product.photo_url} 
                    alt={product.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Smartphone size={48} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                )}
                
                <div className="absolute top-3 left-3">
                  {getStatusBadge(product.status)}
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-1">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.model}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-1">
                    <span>{product.color}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                    <span>{product.storage}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                    <span>IMEI</span>
                    <span>Harga Jual</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-mono text-indigo-400/80">{maskIMEI(product.imei)}</span>
                    <span className="text-base font-bold text-white">{formatRupiah(product.selling_price)}</span>
                  </div>
                </div>

                {product.assigned_to && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--muted)] uppercase font-bold">Staf</span>
                    <span className="text-xs font-medium text-white">{(product as any).assigned_user?.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <BarcodeScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScan}
      />

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductForm 
          initialImei={scannedImei}
          onClose={() => {
            setIsAddModalOpen(false);
            setScannedImei('');
          }}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
