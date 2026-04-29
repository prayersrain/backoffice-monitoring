'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  DollarSign, 
  Save, 
  Loader2, 
  AlertCircle,
  Percent,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';

export default function OwnerPengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: '',
    default_amount: 200000,
    min_amount: 200000,
    max_amount: 250000
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('commission_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setSettings(data as any);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('commission_settings')
        .update({
          default_amount: settings.default_amount,
          min_amount: settings.min_amount,
          max_amount: settings.max_amount,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      alert('Pengaturan berhasil disimpan!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Pengaturan</span> Bisnis
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Atur parameter komisi dan batasan sistem untuk seluruh staf.
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Settings */}
          <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Percent size={20} />
              </div>
              <h2 className="font-bold text-lg">Skema Komisi</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Komisi Default per Unit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">Rp</span>
                  <input 
                    type="number"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={settings.default_amount}
                    onChange={e => setSettings({...settings, default_amount: Number(e.target.value)})}
                  />
                </div>
                <p className="text-[10px] text-[var(--muted)]">Nilai yang otomatis muncul saat mendaftarkan produk baru.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--muted)] uppercase">Batas Minimum</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-bold">Rp</span>
                    <input 
                      type="number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                      value={settings.min_amount}
                      onChange={e => setSettings({...settings, min_amount: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--muted)] uppercase">Batas Maksimum</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-bold">Rp</span>
                    <input 
                      type="number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                      value={settings.max_amount}
                      onChange={e => setSettings({...settings, max_amount: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Simpan Perubahan
              </button>
            </div>
          </form>

          {/* Info & Policy */}
          <div className="space-y-6">
            <div className="glass-card p-6 bg-green-500/5 border-green-500/10">
              <div className="flex gap-4">
                <ShieldCheck className="text-green-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-white">Kebijakan Komisi</h4>
                  <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                    Sistem ini didesain dengan model **Negotiable Commission**. Owner bisa mengatur nilai komisi yang berbeda untuk setiap unit iPhone berdasarkan tingkat kesulitan penjualan atau margin yang tersedia.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-amber-500/5 border-amber-500/10">
              <div className="flex gap-4">
                <AlertCircle className="text-amber-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-white">Keamanan Margin</h4>
                  <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                    Sistem akan memberikan peringatan jika total komisi staf melebihi batas margin keuntungan yang kamu tentukan. Pastikan harga jual selalu lebih tinggi dari (Harga Modal + Komisi).
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <TrendingUp size={32} />
              </div>
              <div>
                <h3 className="font-bold">Automasi Laporan</h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Semua perubahan pengaturan di sini akan langsung berdampak pada perhitungan profit di halaman Laporan & Analitik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
