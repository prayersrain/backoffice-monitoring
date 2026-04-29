import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('name, role')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');
  if (profile.role !== 'staff') redirect('/owner');

  // Get pending requests count
  const { count } = await supabase
    .from('stock_requests')
    .select('*', { count: 'exact', head: true })
    .eq('staff_id', user.id)
    .eq('status', 'pending');

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role="staff"
        userName={profile.name}
        pendingRequests={count || 0}
      />
      <main className="flex-1 md:ml-[260px] mt-[var(--navbar-height)] md:mt-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
