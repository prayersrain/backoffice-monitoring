'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Smartphone, 
  User as UserIcon, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, maskIMEI } from '@/lib/utils';
import type { Product, User } from '@/types';

export default function StaffTimPage() {
  const [staf, setStaf] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all staff members
    const { data: sData } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'staff')
      .order('name', { ascending: true });

    // Fetch all products that are assigned
    const { data: pData } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'assigned');

    if (sData) setStaf(sData as any);
    if (pData) setProducts(pData as any);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Stok <span className="gradient-text">Tim Staf</span>
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Lihat unit iPhone yang sedang dipegang oleh rekan tim lainnya.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
        <input 
          type="text"
          placeholder="Cari nama staf atau model iPhone..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-all text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff & Products List */}
      <div className="space-y-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-48 animate-pulse" />
            ))}
          </div>
        ) : staf.length === 0 ? (
          <div className="glass-card p-20 text-center text-[var(--muted)]">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>Belum ada data tim tersedia.</p>
          </div>
        ) : (
          staf.map((member) => {
            const memberProducts = products.filter(p => p.assigned_to === member.id);
            
            // Skip if searching and no match for name or any of their products
            const isMatch = 
              member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              memberProducts.some(p => p.model.toLowerCase().includes(searchQuery.toLowerCase()));
            
            if (searchQuery && !isMatch) return null;

            return (
              <div key={member.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">{member.name}</h3>
                      <p className="text-xs text-[var(--muted)]">{memberProducts.length} unit dipegang</p>
                    </div>
                  </div>
                  
                  <a 
                    href={`https://wa.me/?text=Halo ${member.name}, mau tanya stok iPhone...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Chat WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {memberProducts.length === 0 ? (
                    <div className="sm:col-span-3 p-8 rounded-2xl bg-white/5 border border-white/5 border-dashed text-center text-[var(--muted)] text-xs">
                      Staf ini sedang tidak memegang stok unit.
                    </div>
                  ) : (
                    memberProducts.map((p) => (
                      <div key={p.id} className="glass-card p-4 flex gap-4 hover:border-indigo-500/20 transition-all">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                          {p.photo_url ? (
                            <img src={p.photo_url} className="w-full h-full object-cover" />
                          ) : (
                            <Smartphone className="text-white/10" size={24} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{p.model}</h4>
                          <p className="text-[10px] text-[var(--muted)] uppercase font-bold mt-0.5">{p.color} • {p.storage}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-indigo-400/70">{maskIMEI(p.imei)}</span>
                            <span className="text-xs font-bold text-white">{formatRupiah(p.selling_price)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
