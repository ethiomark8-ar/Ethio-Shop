export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt: any;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  thumbnails: string[];
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  paymentReference?: string;
  createdAt: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  read: boolean;
  createdAt: any;
}
