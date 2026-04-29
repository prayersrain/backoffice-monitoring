// ============================================
// Database Types — Back Office Monitoring
// ============================================

export type UserRole = 'owner' | 'staff';
export type ProductStatus = 'warehouse' | 'assigned' | 'sold';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

// --- Users ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

// --- Products ---
export interface Product {
  id: string;
  imei: string;
  model: string;
  color: string;
  storage: string;
  purchase_price: number; // hidden from staff
  selling_price: number;
  commission_amount: number;
  status: ProductStatus;
  assigned_to: string | null;
  created_by: string;
  photo_url: string | null;
  assigned_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_user?: User;
}

// --- Stock Requests ---
export interface StockRequest {
  id: string;
  staff_id: string;
  product_id: string;
  status: RequestStatus;
  note: string | null;
  owner_note: string | null;
  created_at: string;
  resolved_at: string | null;
  // Joined fields
  staff?: User;
  product?: Product;
}

// --- Transactions ---
export interface Transaction {
  id: string;
  product_id: string;
  staff_id: string;
  selling_price: number;
  commission_amount: number;
  buyer_name: string | null;
  payment_method: string;
  buyer_phone: string | null;
  handover_photo_url: string | null;
  sold_at: string;
  // Joined fields
  product?: Product;
  staff?: User;
}

// --- Commission Settings ---
export interface CommissionSettings {
  id: string;
  default_amount: number;
  min_amount: number;
  max_amount: number;
  updated_by: string;
  updated_at: string;
}

// --- Activity Log ---
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: User;
}

// --- Dashboard Stats ---
export interface OwnerDashboardStats {
  total_products: number;
  warehouse_stock: number;
  assigned_stock: number;
  sold_today: number;
  total_sold: number;
  total_revenue: number;
  total_profit: number;
  total_commission_paid: number;
  pending_requests: number;
}

export interface StaffDashboardStats {
  my_products: number;
  my_sold_today: number;
  my_total_sold: number;
  my_total_commission: number;
  pending_requests: number;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
