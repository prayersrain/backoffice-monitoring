import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session - IMPORTANT
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isDashboardRoute =
    request.nextUrl.pathname.startsWith('/owner') ||
    request.nextUrl.pathname.startsWith('/staff');

  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('--- MIDDLEWARE AUTH CHECK ---');
    console.log('User ID:', user.id);
    console.log('Profile Role:', profile?.role);
    console.log('Error:', error?.message);

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === 'owner' ? '/owner' : '/staff';
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user && isDashboardRoute) {
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    console.log('--- MIDDLEWARE DASHBOARD CHECK ---');
    console.log('Path:', request.nextUrl.pathname);
    console.log('Profile Role:', profile?.role);
    console.log('Error:', error?.message);

    if (profile) {
      const isOwnerRoute = request.nextUrl.pathname.startsWith('/owner');
      const isStaffRoute = request.nextUrl.pathname.startsWith('/staff');

      // Only redirect if we are sure about the role and it's on the wrong route
      if (isOwnerRoute && profile.role === 'staff') {
        const url = request.nextUrl.clone();
        url.pathname = '/staff';
        return NextResponse.redirect(url);
      }

      if (isStaffRoute && profile.role === 'owner') {
        const url = request.nextUrl.clone();
        url.pathname = '/owner';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
