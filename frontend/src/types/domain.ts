import type {
  addressTypes,
  discountTypes,
  orderStatuses,
  paymentModes,
  paymentStatuses,
  stockAdjustmentTypes,
  vehicleTypes,
} from "@/constants/enums";
import type { Role } from "@/config/roles.config";

export type AddressType = (typeof addressTypes)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentMode = (typeof paymentModes)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type VehicleType = (typeof vehicleTypes)[number];
export type DiscountType = (typeof discountTypes)[number];
export type StockAdjustmentType = (typeof stockAdjustmentTypes)[number];

export type User = {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  role: Role;
  profileImage?: string | null;
  profileImageUrl?: string | null;
  isActive?: boolean;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type Address = {
  id: string;
  fullName: string;
  mobile: string;
  houseNo: string;
  street: string;
  landmark?: string | null;
  village: string;
  mandal?: string | null;
  district?: string | null;
  state?: string | null;
  pincode: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  addressType: AddressType;
  isDefault: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  imageKey?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type Shop = {
  id: string;
  ownerId?: string;
  name: string;
  mobile: string;
  email?: string | null;
  address: string;
  village: string;
  pincode: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  isOpen: boolean;
  isActive: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string | null;
  brand?: string | null;
  unit: string;
  unitValue?: number | string | null;
  mrp: number | string;
  sellingPrice: number | string;
  imageKey?: string | null;
  imageUrl?: string | null;
  availableStock?: number;
  isAvailable?: boolean;
  category?: Category;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  product: Product;
};

export type Cart = {
  id: string;
  customerId: string;
  shopId: string;
  items: CartItem[];
  shop?: Shop;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  shopId: string;
  addressId: string;
  captainId?: string | null;
  status: OrderStatus;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  subtotal: number | string;
  deliveryFee: number | string;
  platformFee: number | string;
  discount: number | string;
  totalAmount: number | string;
  codAmount?: number | string;
  customerNotes?: string | null;
  cancelReason?: string | null;
  placedAt: string;
  confirmedAt?: string | null;
  packedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
  address?: Address;
  shop?: Shop;
  customer?: User;
  captain?: User | null;
  payment?: {
    amount: number | string;
    paymentMode: PaymentMode;
    paymentStatus: PaymentStatus;
  } | null;
  statusHistory?: Array<{
    id: string;
    oldStatus?: string | null;
    newStatus: string;
    remarks?: string | null;
    createdAt: string;
  }>;
};

export type CaptainProfile = {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleNumber?: string | null;
  licenseNumber?: string | null;
  registrationStatus?: string;
  availabilityStatus?: string;
  isOnline: boolean;
  isAvailable: boolean;
  currentLatitude?: number | string | null;
  currentLongitude?: number | string | null;
  cashInHand: number | string;
  user?: User;
};

export type CaptainTaskOffer = {
  id: string;
  captainId: string;
  deliveryTaskId: string;
  status: string;
  distanceToPickupKm?: number | string | null;
  pickupToDropKm?: number | string | null;
  estimatedEarning?: number | string | null;
  offeredAt?: string;
  respondedAt?: string | null;
  expiresAt?: string | null;
  rejectionReason?: string | null;
};

export type CaptainEarning = {
  id: string;
  captainId: string;
  deliveryTaskId: string;
  amount: number | string;
  status?: string;
  createdAt?: string;
};

export type DeliveryTask = {
  id: string;
  taskType: string;
  referenceId: string;
  referenceTable: string;
  captainId?: string | null;
  status: string;
  pickupName?: string | null;
  pickupPhone?: string | null;
  pickupAddress: string;
  pickupLatitude?: number | string | null;
  pickupLongitude?: number | string | null;
  dropName?: string | null;
  dropPhone?: string | null;
  dropAddress: string;
  dropLatitude?: number | string | null;
  dropLongitude?: number | string | null;
  deliveryFee: number | string;
  distanceKm?: number | string | null;
  estimatedPickupAt?: string | null;
  estimatedDeliveryAt?: string | null;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  failureReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  offers?: CaptainTaskOffer[];
  earnings?: CaptainEarning[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  payload?: Record<string, unknown> | null;
};

export type ShopInventoryItem = {
  id: string;
  shopId: string;
  productId: string;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  damagedStock: number;
  lowStockAlert: number;
  isAvailable: boolean;
  product: Product;
};

export type DashboardSummary = {
  totalOrders?: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  deliveredOrders?: number;
  cancelledOrders: number;
  lowStockProducts?: number;
  activeCustomers?: number;
  activeShops?: number;
  activeCaptains?: number;
};

export type ReportRow = Record<string, string | number | null>;

export type Coupon = {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  value: number | string;
  minOrderAmount: number | string;
  maxDiscount?: number | string | null;
  usageLimit?: number | null;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
};
