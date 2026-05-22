export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;      // human-readable: ORD-2024-0001
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    country: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
