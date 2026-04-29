'use client';

import { useState } from 'react';
import { Camera, X, Smartphone, Hash, Palette, HardDrive, DollarSign, Percent, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';

interface AddProductFormProps {
  initialImei?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductForm({ initialImei = '', onClose, onSuccess }: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    imei: initialImei,
    model: '',
    color: '',
    storage: '',
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
        model: formData.model,
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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="glass-card w-full max-w-2xl my-auto animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Daftarkan <span className="gradient-text">iPhone Baru</span></h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <input 
                required
                placeholder="Scan atau ketik IMEI..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                value={formData.imei}
                onChange={e => setFormData({...formData, imei: e.target.value})}
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase flex items-center gap-2">
                <Smartphone size={14} /> Model iPhone
              </label>
              <input 
                required
                placeholder="Contoh: iPhone 15 Pro Max"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
              />
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
