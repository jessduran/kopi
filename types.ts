
export interface Letter {
  id: string;
  recipient: string;
  content: string;
  date: string;
  mood: string;
  paperType: 'napkin' | 'standard' | 'parchment';
  isSpecial?: boolean;
}

export interface MenuItemConfig {
  id: string;
  title: string;
  description: string;
  price: string;
  letterId?: string;
  isAvailable: boolean;
  category: 'The Signature' | 'Daily Brews' | 'Sweet Additions';
}

export type UserRole = 'creator' | 'recipient' | null;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type PaperStyle = 'napkin' | 'standard' | 'parchment';

export enum CoffeeMood {
  ESPRESSO = 'Espresso (Bold & Direct)',
  LATTE = 'Latte (Soft & Creamy)',
  CAPPUCCINO = 'Cappuccino (Frothy & Light)',
  AMERICANO = 'Americano (Clean & Honest)',
  MOCHA = 'Mocha (Sweet & Bittersweet)'
}
