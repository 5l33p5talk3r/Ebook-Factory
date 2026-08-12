export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  description: string;
  price: number;
  currency: 'USD';
  coverUrl: string;
  formats: Array<'PDF' | 'EPUB'>;
  featured?: boolean;
  publishedAt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'prod-ai-agency-2026',
    slug: 'ai-marketing-agency-blueprint',
    title: 'AI Marketing Agency Blueprint',
    subtitle: 'A practical operating system for building an AI-powered service business.',
    author: 'Ebook Factory Studio',
    category: 'Business & AI',
    description: 'A practical guide to positioning, offers, automation, client acquisition, delivery systems, and recurring revenue for an AI-assisted agency.',
    price: 19.99,
    currency: 'USD',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85',
    formats: ['PDF', 'EPUB'],
    featured: true,
    publishedAt: '2026-08-01'
  },
  {
    id: 'prod-no-code-saas',
    slug: 'no-code-saas-empire',
    title: 'No-Code SaaS Empire',
    subtitle: 'From idea to a focused micro-SaaS without a traditional engineering team.',
    author: 'Ebook Factory Studio',
    category: 'Technology & Entrepreneurship',
    description: 'Learn how to validate an idea, design the offer, assemble a no-code stack, launch, onboard customers, and build repeatable acquisition systems.',
    price: 18.99,
    currency: 'USD',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
    formats: ['PDF', 'EPUB'],
    featured: true,
    publishedAt: '2026-08-02'
  },
  {
    id: 'prod-focus-systems',
    slug: 'focus-systems',
    title: 'Focus Systems',
    subtitle: 'A practical framework for turning scattered effort into consistent output.',
    author: 'Ebook Factory Studio',
    category: 'Productivity',
    description: 'A practical productivity framework covering planning, prioritization, friction reduction, focused work sessions, and weekly review systems.',
    price: 12.99,
    currency: 'USD',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85',
    formats: ['PDF', 'EPUB'],
    publishedAt: '2026-08-03'
  }
];

export function getProduct(id: string) {
  return PRODUCTS.find(product => product.id === id);
}
