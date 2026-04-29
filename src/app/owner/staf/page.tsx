'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  MoreVertical, 
  User as UserIcon, 
  Smartphone,
  ChevronRight,
  Loader2,
  X,
  Lock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types';

export default function OwnerStafPage() {
  const [staf, setStaf] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaf, setNewStaf] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchStaf();
  }, []);

  const fetchStaf = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'staff')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStaf(data as any);
    }
    setLoading(false);
  };

  const handleAddStaf = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      // 1. Create user in Supabase Auth
      // Note: In a real production app, you might want to use a service role or a specialized edge function
      // for owner to create users without them having to sign up themselves.
      // For now, we'll use the signUp method which might require email verification depending on Supabase settings.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStaf.email,
        password: newStaf.password,
        options: {
          data: {
            name: newStaf.name,
            role: 'staff'
          }
        }
      });

      if (authError) throw authError;

      alert('Staf berhasil didaftarkan! Silakan cek email untuk verifikasi jika diaktifkan.');
      setIsAddModalOpen(false);
      setNewStaf({ email: '', password: '', name: '' });
      fetchStaf();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Manajemen <span className="gradient-text">Staf</span>
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Kelola akses dan pantau performa tim Vali, Jati, Hanif, dan Haikal.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
        >
          <UserPlus size={18} />
          <span>Tambah Staf</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
        <input 
          type="text"
          placeholder="Cari nama atau email staf..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-all text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staf Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : staf.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[var(--muted)]">
            <UserIcon size={32} />
          </div>
          <p className="text-[var(--muted)]">Belum ada staf yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staf
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((s) => (
            <div key={s.id} className="glass-card group hover:border-indigo-500/30 transition-all p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{s.name}</h3>
                    <div className="flex items-center gap-1 text-[var(--muted)] text-xs mt-1">
                      <Mail size={12} />
                      <span className="truncate max-w-[150px]">{s.email}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-white/5 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Status</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Aktif
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Role</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                    <Shield size={12} />
                    Staf
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-xs font-medium text-[var(--muted)] transition-all">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-indigo-400" />
                  <span>Lihat Produk Pegangan</span>
                </div>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Staf Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-card w-full max-w-md animate-fadeInUp">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Tambah <span className="gradient-text">Staf Baru</span></h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStaf} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                  <input 
                    required
                    type="text"
                    placeholder="Contoh: Vali"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                    value={newStaf.name}
                    onChange={e => setNewStaf({...newStaf, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                  <input 
                    required
                    type="email"
                    placeholder="vali@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                    value={newStaf.email}
                    onChange={e => setNewStaf({...newStaf, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Password Sementara</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                  <input 
                    required
                    type="password"
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all"
                    value={newStaf.password}
                    onChange={e => setNewStaf({...newStaf, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all font-bold text-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="flex-[2] px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
