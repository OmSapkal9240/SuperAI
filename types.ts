
export enum MessageRole {
  USER = 'user',
  BOT = 'bot'
}

export type AppScreen = 'home' | 'chat' | 'library' | 'orders' | 'profile' | 'address' | 'success';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  description: string;
  usage: string;
  sideEffects: string;
  stock: number;
  unit: string;
  prescriptionRequired: boolean;
  price: number;
  category: 'Heart' | 'Diabetes' | 'Pain' | 'Stomach' | 'General';
}

export interface OrderHistory {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  date: string;
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'Processing';
  price: number;
}

export interface RefillAlert {
  id: string;
  medicineName: string;
  userName: string;
  daysRemaining: number;
}

export interface Address {
  fullName: string;
  line1: string;
  city: string;
  pincode: string;
}

export interface OrderDraft {
  medicine: Medicine | null;
  quantity: number;
  address: Address | null;
}
