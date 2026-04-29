'use client';

import { useState, useEffect } from 'react';
import { 
  Scan, 
  Smartphone, 
  DollarSign, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Tag,
  Hash
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, maskIMEI } from '@/lib/utils';
import type { Product } from '@/types';
import BarcodeScanner from '@/components/ui/BarcodeScanner';

export default function StaffJualPage() {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Sale details
  const [salePrice, setSalePrice] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const supabase = createClient();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('status', 'assigned')
        .order('assigned_at', { ascending: false });

      if (data) setMyProducts(data as any);
    }
    setLoading(false);
  };

  const handleScan = (imei: string) => {
    const product = myProducts.find(p => p.imei === imei);
    if (product) {
      handleSelectProduct(product);
    } else {
      alert('IMEI tidak ditemukan di daftar unit yang kamu pegang. Pastikan unit sudah di-approve Owner.');
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSalePrice(product.selling_price.toString());
    setIsSaleModalOpen(true);
  };

  const handleConfirmSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const finalSalePrice = parseFloat(salePrice);
      const commission = selectedProduct.commission_amount;
      
      // 1. Create Transaction record
      const { error: transError } = await supabase.from('transactions').insert({
        product_id: selectedProduct.id,
        staff_id: user.id,
        selling_price: finalSalePrice,
        commission_amount: commission,
        buyer_name: buyerName || 'Customer',
        payment_method: paymentMethod,
        sold_at: new Date().toISOString()
      });

      if (transError) throw transError;

      // 2. Update Product status to sold
      const { error: prodError } = await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', selectedProduct.id);

      if (prodError) throw prodError;

      alert('Penjualan Berhasil Dicatat! Komisi kamu otomatis bertambah.');
      setIsSaleModalOpen(false);
      fetchMyProducts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Catat <span className="gradient-text">Penjualan</span>
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Pilih atau scan unit yang berhasil kamu jual hari ini.
          </p>
        </div>
        
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
        >
          <Scan size={18} />
          <span>Scan Unit</span>
        </button>
      </div>

      {/* Warning Info */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
        <AlertCircle className="text-indigo-400 shrink-0" size={20} />
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Hanya unit yang sudah **di-approve** Owner dan berstatus "Dipegang Staf" yang bisa dijual. 
          Pastikan IMEI sudah sesuai dengan fisik unit.
        </p>
      </div>

      {/* My Assigned Products */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Unit Yang Saya Pegang ({myProducts.length})</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : myProducts.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <Smartphone size={48} className="mx-auto text-[var(--muted)] opacity-20" />
          <p className="text-[var(--muted)]">Kamu sedang tidak memegang unit apapun.</p>
          <button className="text-indigo-400 text-sm font-bold">Ke Gudang untuk Ambil Stok &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map((p) => (
            <div 
              key={p.id} 
              onClick={() => handleSelectProduct(p)}
              className="glass-card p-5 group hover:border-green-500/30 transition-all cursor-pointer flex gap-4 items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                {p.photo_url ? (
                  <img src={p.photo_url} className="w-full h-full object-cover" />
                ) : (
                  <Smartphone className="text-white/10" size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white line-clamp-1">{p.model}</h3>
                <p className="text-[10px] text-[var(--muted)] uppercase font-bold">{p.color} • {p.storage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono text-[var(--muted)]">{maskIMEI(p.imei)}</span>
                  <span className="text-sm font-bold text-green-400">{formatRupiah(p.selling_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />

      {/* Sale Confirmation Modal */}
      {isSaleModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="glass-card w-full max-w-md animate-fadeInUp">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Konfirmasi <span className="text-green-400">Penjualan</span></h2>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-[var(--muted)]">
                <CheckCircle2 size={24} className="opacity-0" /> {/* Spacer */}
                <span className="text-sm">Batal</span>
              </button>
            </div>

            <form onSubmit={handleConfirmSale} className="p-6 space-y-6">
              {/* Product Summary */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{selectedProduct.model}</h4>
                  <p className="text-xs text-[var(--muted)]">{selectedProduct.color} • {selectedProduct.storage}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--muted)] flex items-center gap-2">
                    <Tag size={12} /> Harga Jual Akhir
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-bold">Rp</span>
                    <input 
                      required
                      type="number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500 outline-none transition-all text-white font-bold text-lg"
                      value={salePrice}
                      onChange={e => setSalePrice(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--muted)]">Harga default: {formatRupiah(selectedProduct.selling_price)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--muted)] flex items-center gap-2">
                    <Hash size={12} /> Nama Pembeli
                  </label>
                  <input 
                    placeholder="Contoh: Budi Sudarsono"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                    <p className="text-[10px] uppercase font-bold text-green-400/80 mb-1">Komisi Kamu</p>
                    <p className="text-lg font-bold text-white">{formatRupiah(selectedProduct.commission_amount)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                    <p className="text-[10px] uppercase font-bold text-indigo-400/80 mb-1">Metode</p>
                    <select 
                      className="bg-transparent text-white font-bold outline-none cursor-pointer"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Transfer">Transfer</option>
                      <option value="QRIS">QRIS</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={actionLoading}
                className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                Selesaikan Penjualan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
