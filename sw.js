export interface StorefrontProduct {
  id: string;
  projectId?: string;
  title: string;
  subtitle?: string;
  author: string;
  niche: string;
  category: 'Tech & AI' | 'Business & Finance' | 'Self-Improvement' | 'Health & Longevity' | 'Fiction & Storytelling' | 'Creative & Crafts';
  price: number;
  coverUrl: string;
  description: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  pageCount: number;
  publishedAt: string;
  sampleChapter: {
    title: string;
    content: string;
  };
  formats: ('PDF' | 'EPUB' | 'MOBI' | 'Audiobook')[];
  featured?: boolean;
}

export interface CartItem {
  product: StorefrontProduct;
  quantity: number;
}

export interface OrderEntitlement {
  productId: string;
  title: string;
  downloadUrl: string;
  purchasedAt: string;
  receiptId: string;
}

export interface CompletedOrder {
  id: string;
  receiptId: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  items: CartItem[];
  entitlements: OrderEntitlement[];
  purchasedAt: string;
  paypalOrderId?: string;
}

export interface NicheReport {
  topic: string;
  opportunityScore: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  demandScore: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  profitPotential: string;
  trendDirection: 'Upward' | 'Steady' | 'Explosive';
  searchVolume: string;
  keywordClusters: {
    keyword: string;
    volume: string;
    difficulty: string;
    intent: string;
  }[];
  targetAudience: {
    personaName: string;
    ageRange: string;
    painPoints: string[];
    buyingTriggers: string[];
  };
  competitorNotes: {
    marketGap: string;
    weaknesses: string[];
    pricePointRange: string;
  };
  suggestedAngles: {
    title: string;
    subtitle: string;
    hook: string;
    targetPrice: number;
  }[];
  validationChecklist: {
    item: string;
    passed: boolean;
    note: string;
  }[];
}

export interface StorefrontSettings {
  storeName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  featuredCategory: string;
  accentColor: string;
  customDomain?: string;
}
