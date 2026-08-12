export interface ChapterOutline {
  title: string;
  description: string;
  writingStyle?: string;
}

export interface Project {
  id?: string;
  userId: string;
  title: string;
  author?: string;
  niche: string;
  coverUrl?: string;
  coverUrls?: string[];
  status: 'draft' | 'generating' | 'ready' | 'published';
  pricing?: number;
  createdAt: any;
  updatedAt: any;
  formatting?: {
    fontFamily?: string;
    lineSpacing?: number;
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'justify';
  };
  platforms?: {
    amazon?: boolean;
    apple?: boolean;
    google?: boolean;
  };
  outline?: ChapterOutline[];
  coverStyle?: string;
  coverStyles?: string[];
  coverKeywords?: string;
  writingStyle?: string;
  tone?: string;
  audience?: string;
  templateId?: string;
  isTranslated?: boolean;
  autoFactCheck?: boolean;
  marketplaceLinks?: {
    amazon?: string;
    apple?: string;
    google?: string;
    other?: string;
  };
  collaboratorEmails?: string[];
  collaborators?: {
    email: string;
    role: 'editor' | 'viewer';
    invitedAt: string;
  }[];
}

export interface Chapter {
  id?: string;
  index: number;
  title: string;
  contentUrl: string;
  summary?: string;
  wordCount?: number;
  isReviewed?: boolean;
  writingStyle?: string;
  images?: string[];
  factCheck?: {
    lastCheckedAt: any;
    claims: Array<{
      claim: string;
      status: 'accurate' | 'inaccurate' | 'partially_accurate' | 'unverified';
      confidence: number;
      evidence: string;
      sources: string[];
    }>;
  };
  translations?: {
    [langCode: string]: {
      title: string;
      contentUrl: string;
      summary?: string;
    };
  };
}

export interface GrammarResult {
  improvedText: string;
  suggestions: Array<{
    original: string;
    improved: string;
    explanation: string;
  }>;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
}

export interface NicheOption {
  id: string;
  title: string;
  potential: 'High' | 'Medium' | 'Low';
  competition: 'High' | 'Medium' | 'Low';
  timeToMarket: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultWritingStyle: string;
  defaultTone: string;
  defaultAudience: string;
  defaultFormatting: {
    fontFamily: string;
    lineSpacing: number;
    fontSize: number;
    textAlign: 'left' | 'center' | 'justify';
  };
  suggestedNiches: string[];
}
