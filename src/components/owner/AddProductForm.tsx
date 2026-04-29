'use client';

import { useState } from 'react';
import { Camera, X, Smartphone, Hash, Palette, HardDrive, DollarSign, Percent, Loader2, Scan } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';
import BarcodeScanner from '@/components/ui/BarcodeScanner';
import { getSpecsByScannedText, ALL_IPHONE_MODELS } from '@/lib/constants/iphone-models';
import { Search } from 'lucide-react';

interface AddProductFormProps {
  initialData?: {
    imei?: string;
    model?: string;
    color?: string;
    storage?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductForm({ initialData = {}, onClose, onSuccess }: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeScanner, setActiveScanner] = useState<'imei' | 'model' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    imei: initialData.imei || '',
    model: initialData.model || '',
    color: initialData.color || '',
    storage: initialData.storage || '',
    region: 'PA/A', // Default region iBox/Indonesia
    purchase_price: '',
    selling_price: '',
    commission_amount: '200000',
  });

  const supabase = createClient();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let photoUrl = '';
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      const { error } = await supabase.from('products').insert({
        imei: formData.imei,
        model: `${formData.model} (${formData.region})`,
        color: formData.color,
        storage: formData.storage,
        purchase_price: parseFloat(formData.purchase_price),
        selling_price: parseFloat(formData.selling_price),
        commission_amount: parseFloat(formData.commission_amount),
        created_by: user.id,
        photo_url: photoUrl,
        status: 'warehouse'
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInternalScan = (text: string) => {
    if (activeScanner === 'imei') {
      // Jika yang di-scan adalah QR panjang, ambil IMEI-nya saja
      const imeiMatch = text.match(/\d{15}/);
      setFormData({ ...formData, imei: imeiMatch ? imeiMatch[0] : text });
    } else if (activeScanner === 'model') {
      const specs = getSpecsByScannedText(text);
      if (specs) {
        setFormData({
          ...formData,
          model: specs.model,
          color: specs.color,
          storage: specs.storage
        });
      } else {
        alert('Model tidak dikenali di kamus. Silakan isi manual.');
      }
    }
    setActiveScanner(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <BarcodeScanner 
        isOpen={!!activeScanner}
        onClose={() => setActiveScanner(null)}
        onScan={handleInternalScan}
      />

      <div className="glass-card w-full max-w-2xl my-auto animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Daftarkan <span className="gradient-text">iPhone Baru</span></h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Model Lookup (The new searchable dropdown) */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <Search size={14} /> Pencarian Cepat Kode Model (MPN)
            </label>
            <div className="relative group">
              <input 
                type="text"
                placeholder="Ketik kode (contoh: MQ9T3, MPUF3...)"
                className="w-full pl-4 pr-4 py-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-indigo-100 placeholder:text-indigo-500/40 font-mono"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value.toUpperCase());
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              
              {showSuggestions && searchTerm.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-2xl bg-[#1a1c2e] border border-white/10 shadow-2xl z-[120] animate-fadeIn">
                  {ALL_IPHONE_MODELS
                    .filter(m => m.mpn?.includes(searchTerm))
                    .slice(0, 10) // Limit suggestions for performance
                    .map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="w-full px-5 py-3 text-left hover:bg-indigo-600 transition-all border-b border-white/5 last:border-0 flex items-center justify-between group"
                        onClick={() => {
                          // Normalisasi storage (hapus spasi agar cocok dengan dropdown)
                          const cleanStorage = m.storage.replace(/\s/g, '');
                          
                          setFormData({
                            ...formData,
                            model: m.model,
                            color: m.color,
                            storage: cleanStorage
                          });
                          setSearchTerm(m.mpn || '');
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white group-hover:text-white">{m.mpn} - {m.model}</span>
                          <span className="text-[10px] text-[var(--muted)] group-hover:text-indigo-100 uppercase font-bold">{m.color} | {m.storage}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 text-[10px] font-bold">PILIH</div>
                      </button>
                    ))}
                  {ALL_IPHONE_MODELS.filter(m => m.mpn?.includes(searchTerm)).length === 0 && (
                    <div className="p-4 text-center text-xs text-[var(--muted)]">Kode tidak ditemukan</div>
                  )}
                </div>
              )}
            </div>
            <p className="text-[10px] text-indigo-400/60 italic">Gunakan ini untuk mengisi data Model, Warna, & Kapasitas secara instan tanpa scan.</p>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Photo Upload Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="relative w-40 h-40 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/10 transition-all overflow-hidden"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Foto Produk</span>
                </div>
              )}
            </div>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handlePhotoChange}
            />
            <p className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-widest">Wajib: Foto kondisi iPhone saat diterima</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IMEI */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <Hash size={14} /> IMEI
              </label>
              <div className="relative">
                <input 
                  required
                  placeholder="Scan atau ketik IMEI..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.imei}
                  onChange={e => setFormData({...formData, imei: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setActiveScanner('imei')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                >
                  <Scan size={18} />
                </button>
              </div>
            </div>

            {/* Model & Region */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <Smartphone size={14} /> Model & Region
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    required
                    placeholder="Nama Model..."
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                    value={formData.model}
                    onChange={e => setFormData({...formData, model: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setActiveScanner('model')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                  >
                    <Scan size={18} />
                  </button>
                </div>
                <select 
                  className="w-24 px-2 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-xs font-bold"
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                >
                  <option value="PA/A">PA/A</option>
                  <option value="ID/A">ID/A</option>
                  <option value="LL/A">LL/A</option>
                  <option value="ZP/A">ZP/A</option>
                  <option value="KH/A">KH/A</option>
                  <option value="J/A">J/A</option>
                </select>
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <Palette size={14} /> Warna
              </label>
              <input 
                required
                placeholder="Contoh: Natural Titanium"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <HardDrive size={14} /> Kapasitas
              </label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all appearance-none"
                value={formData.storage}
                onChange={e => setFormData({...formData, storage: e.target.value})}
              >
                <option value="">Pilih Kapasitas</option>
                <option value="16GB">16GB</option>
                <option value="32GB">32GB</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            {/* Purchase Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <DollarSign size={14} /> Harga Beli (Modal)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">Rp</span>
                <input 
                  required
                  type="number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.purchase_price}
                  onChange={e => setFormData({...formData, purchase_price: e.target.value})}
                />
              </div>
            </div>

            {/* Selling Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <DollarSign size={14} /> Harga Jual
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm">Rp</span>
                <input 
                  required
                  type="number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-white font-bold"
                  value={formData.selling_price}
                  onChange={e => setFormData({...formData, selling_price: e.target.value})}
                />
              </div>
            </div>

            {/* Commission (Negotiable Default) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center justify-between">
                <div className="flex items-center gap-2"><Percent size={14} /> Komisi Staf</div>
                <div className="text-indigo-400">Profit Owner: {formData.selling_price && formData.purchase_price ? formatRupiah(Number(formData.selling_price) - Number(formData.purchase_price) - Number(formData.commission_amount)) : '-'}</div>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">Rp</span>
                <input 
                  required
                  type="number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.commission_amount}
                  onChange={e => setFormData({...formData, commission_amount: e.target.value})}
                />
              </div>
              <p className="text-[10px] text-[var(--muted)]">Default komisi adalah Rp 200.000. Kamu bisa mengubahnya per unit sesuai negosiasi.</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-sm"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Inventori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
