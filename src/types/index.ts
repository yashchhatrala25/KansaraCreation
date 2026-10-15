export type ProductCategory = "Wall Hangings" | "Hair Bows" | "Dreamcatchers";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNote?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Visit {
  id: string;
  page: string;
  timestamp: string;
  sessionId: string;
  device?: string;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "COD" | "UPI";
}
