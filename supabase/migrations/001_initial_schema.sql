-- ============================================
-- Supabase Database Migration
-- Back Office Monitoring - iPhone Reseller
-- ============================================

-- 1. USERS TABLE
-- Extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'staff')) DEFAULT 'staff',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. COMMISSION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_amount DECIMAL(12,2) NOT NULL DEFAULT 200000,
  min_amount DECIMAL(12,2) NOT NULL DEFAULT 200000,
  max_amount DECIMAL(12,2) NOT NULL DEFAULT 250000,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default commission settings
INSERT INTO public.commission_settings (default_amount, min_amount, max_amount)
VALUES (200000, 200000, 250000);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imei TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  storage TEXT NOT NULL,
  purchase_price DECIMAL(12,2) NOT NULL,
  selling_price DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL DEFAULT 200000,
  status TEXT NOT NULL CHECK (status IN ('warehouse', 'assigned', 'sold')) DEFAULT 'warehouse',
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID NOT NULL REFERENCES public.users(id),
  photo_url TEXT,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. STOCK REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.stock_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.users(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  note TEXT,
  owner_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  staff_id UUID NOT NULL REFERENCES public.users(id),
  final_price DECIMAL(12,2) NOT NULL,
  purchase_price_snapshot DECIMAL(12,2) NOT NULL,
  staff_commission DECIMAL(12,2) NOT NULL,
  owner_profit DECIMAL(12,2) NOT NULL,
  buyer_name TEXT,
  buyer_phone TEXT,
  handover_photo_url TEXT,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_assigned_to ON public.products(assigned_to);
CREATE INDEX idx_products_imei ON public.products(imei);
CREATE INDEX idx_stock_requests_status ON public.stock_requests(status);
CREATE INDEX idx_stock_requests_staff ON public.stock_requests(staff_id);
CREATE INDEX idx_transactions_staff ON public.transactions(staff_id);
CREATE INDEX idx_transactions_sold_at ON public.transactions(sold_at);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can read all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Owner can manage users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- PRODUCTS policies
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Owner can manage products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Owner can update any product" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Owner can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- STOCK REQUESTS policies
CREATE POLICY "Staff can create requests" ON public.stock_requests FOR INSERT WITH CHECK (
  auth.uid() = staff_id
);
CREATE POLICY "Staff can read own requests" ON public.stock_requests FOR SELECT USING (
  auth.uid() = staff_id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Owner can update requests" ON public.stock_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- TRANSACTIONS policies
CREATE POLICY "Staff can create transactions" ON public.transactions FOR INSERT WITH CHECK (
  auth.uid() = staff_id
);
CREATE POLICY "Staff reads own transactions" ON public.transactions FOR SELECT USING (
  auth.uid() = staff_id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- COMMISSION SETTINGS policies
CREATE POLICY "Anyone can read commission" ON public.commission_settings FOR SELECT USING (true);
CREATE POLICY "Owner can update commission" ON public.commission_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- ACTIVITY LOG policies
CREATE POLICY "Users can insert own logs" ON public.activity_log FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Owner can read all logs" ON public.activity_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this in Supabase SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
