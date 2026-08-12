import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Eye, 
  Download, 
  HelpCircle, 
  DollarSign,
  Layers,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { StorefrontProduct } from '../types/factory';
import { FEATURED_PRODUCTS } from '../data/mockStorefront';

interface StorefrontProps {
  onSelectProduct: (product: StorefrontProduct) => void;
  onAddToCart: (product: StorefrontProduct) => void;
  onOpenCart: () => void;
  onLaunchCreatorStudio: () => void;
  onNavigateToNiche: () => void;
  cartCount: number;
  isAdmin?: boolean;
}

export const Storefront: React.FC<StorefrontProps> = ({
  onSelectProduct,
  onAddToCart,
  onOpenCart,
  onLaunchCreatorStudio,
  onNavigateToNiche,
  cartCount,
  isAdmin = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<StorefrontProduct | null>(null);

  const categories = ['All', 'Tech & AI', 'Business & Finance', 'Self-Improvement', 'Health & Longevity', 'Fiction & Storytelling'];

  const filteredProducts = FEATURED_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#252836] bg-gradient-to-b from-[#131622] via-[#0B0D12] to-[#0B0D12]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201D13] border border-[#584B28] text-[#E5C158] text-xs font-medium uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F0D078]" />
              The AI-Powered Ebook Publishing Engine & Marketplace
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]"
            >
              Discover High-Value Ebooks & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0D078] via-[#D4AF37] to-[#B58A28]">
                Publish Your Own Empire
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-slate-300 font-light leading-relaxed"
            >
              From AI-validated market niche research to automated chapter drafting, cover design, and direct global digital sales with instant PayPal payouts.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onLaunchCreatorStudio}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                Launch Creator Studio
              </button>

              <button
                onClick={onNavigateToNiche}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181B26] border border-[#3A3E52] text-slate-200 font-medium hover:bg-[#202434] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#E5C158]" />
                Explore Niche Intelligence
              </button>
            </motion.div>

            {/* Metrics Ticker */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#252836]">
              <div>
                <p className="text-2xl font-bold font-serif text-[#F0D078]">$1.4M+</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Creator Earnings</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-white">48,000+</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Ebooks Generated</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-white">99.2%</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Niche Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-[#F0D078]">Instant</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Digital Deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ebooks & Storefront Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#E5C158]" />
              Featured Storefront Ebooks
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Hand-crafted, AI-verified digital books available for immediate reading and download.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, author, niche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161923] border border-[#2B2F42] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#E5C158]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E5C158] text-black font-semibold shadow-md'
                  : 'bg-[#161923] border border-[#282C3D] text-slate-300 hover:bg-[#202433]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ebook Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="bg-[#131622] border border-[#232738] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#584B28] transition-all shadow-xl"
            >
              <div>
                {/* Cover Frame */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0F111A]">
                  <img
                    src={product.coverUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-[#F0D078] uppercase border border-[#584B28]/50">
                    {product.category}
                  </div>
                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Best Seller
                    </div>
                  )}
                  <button
                    onClick={() => setPreviewProduct(product)}
                    className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-slate-200 p-2 rounded-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs border border-slate-700/60 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#E5C158]" />
                    Sample Chapter
                  </button>
                </div>

                {/* Info Block */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>{product.niche}</span>
                    <div className="flex items-center gap-1 text-[#F0D078]">
                      <Star className="w-3.5 h-3.5 fill-[#F0D078]" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-slate-500">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#F0D078] transition-colors leading-snug">
                    {product.title}
                  </h3>
                  {product.subtitle && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.subtitle}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">By {product.author}</p>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Pricing & Add to Cart Footer */}
              <div className="p-5 pt-0 border-t border-[#1C2030] mt-2 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Instant Access</p>
                  <p className="text-xl font-bold font-serif text-white">${product.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="px-4 py-2.5 rounded-xl bg-[#201D13] border border-[#584B28] text-[#E5C158] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#0F111A] border-y border-[#232738]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-white">Why EbookFactory Leads the Digital Publishing Revolution</h2>
            <p className="text-slate-400 text-sm mt-3">From market demand discovery to instant reader checkout, experience the end-to-end publishing pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141724] border border-[#25293A] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#221F14] border border-[#584B28] flex items-center justify-center text-[#E5C158] mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">1. AI NicheMaster Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze live Amazon search trends, estimated monthly royalties, buyer intent, and competitor gaps with automated scoring before writing a single word.
              </p>
            </div>

            <div className="bg-[#141724] border border-[#25293A] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#221F14] border border-[#584B28] flex items-center justify-center text-[#E5C158] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">2. Deep Chapter Synthesis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate full structured chapters, verify claims via Google Search grounding, check grammar, and generate matching high-resolution 3:4 cover art.
              </p>
            </div>

            <div className="bg-[#141724] border border-[#25293A] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#221F14] border border-[#584B28] flex items-center justify-center text-[#E5C158] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">3. Direct PayPal Commerce</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                List ebooks on your public storefront, capture payments securely with PayPal Smart Buttons, and deliver instant PDF/EPUB download entitlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Creator Plans */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-white">Simple Creator Membership Plans</h2>
          <p className="text-slate-400 text-sm mt-2">Scale from your first AI ebook draft to a multi-author digital publishing empire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-[#131622] border border-[#232738] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Starter Creator</p>
              <h3 className="text-3xl font-serif font-bold text-white mt-2">$0 <span className="text-xs font-sans text-slate-400">/ forever</span></h3>
              <p className="text-xs text-slate-400 mt-2">Essential AI tools to draft and publish your first ebook.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> 2 Ebook Projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Basic Niche Validation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Standard EPUB & PDF Export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Storefront Publishing</li>
              </ul>
            </div>
            <button 
              onClick={onLaunchCreatorStudio}
              className="mt-8 w-full py-3 rounded-xl bg-[#1A1E2D] hover:bg-[#252A3E] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Start for Free
            </button>
          </div>

          {/* Pro Creator Plan */}
          <div className="bg-[#181B28] border-2 border-[#D4AF37] rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl shadow-[#D4AF37]/10">
            <div className="absolute -top-3 right-6 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Most Popular
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">Pro Publisher</p>
              <h3 className="text-3xl font-serif font-bold text-white mt-2">$29 <span className="text-xs font-sans text-slate-400">/ month</span></h3>
              <p className="text-xs text-slate-400 mt-2">Unlimited AI generation, deep NicheMaster, and cover studio.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Unlimited Ebook Projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Full NicheMaster Scored Intelligence</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> AI Cover Art Generation (3:4 1K)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Google Fact-Checking & Translation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Direct PayPal Storefront Payouts</li>
              </ul>
            </div>
            <button 
              onClick={onLaunchCreatorStudio}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Get Pro Access
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#131622] border border-[#232738] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Publishing Agency</p>
              <h3 className="text-3xl font-serif font-bold text-white mt-2">$99 <span className="text-xs font-sans text-slate-400">/ month</span></h3>
              <p className="text-xs text-slate-400 mt-2">Multi-author team management and custom branding.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Multi-Author Collaborator Roles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Custom Storefront Domain Support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E5C158]" /> Priority Cloudflare Worker SLA</li>
              </ul>
            </div>
            <button 
              onClick={onLaunchCreatorStudio}
              className="mt-8 w-full py-3 rounded-xl bg-[#1A1E2D] hover:bg-[#252A3E] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Contact Agency Team
            </button>
          </div>
        </div>
      </section>

      {/* Sample Chapter Preview Modal */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#141724] border border-[#2B3044] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-[#252A3E] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">{previewProduct.niche}</span>
                  <h3 className="text-xl font-serif font-bold text-white">{previewProduct.title}</h3>
                  <p className="text-xs text-slate-400">Sample Chapter Excerpt</p>
                </div>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg bg-[#1D2233] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 font-serif leading-relaxed bg-[#0E1019]">
                <h4 className="text-base font-bold text-[#F0D078] font-sans">{previewProduct.sampleChapter.title}</h4>
                <p>{previewProduct.sampleChapter.content}</p>
                <div className="p-4 rounded-xl bg-[#181C2B] border border-[#2A2F45] text-xs font-sans text-slate-400">
                  <p className="font-semibold text-white mb-1">Want to read the full ebook ({previewProduct.pageCount} pages)?</p>
                  <p>Purchase now to get instant download access in PDF & EPUB formats.</p>
                </div>
              </div>

              <div className="p-6 border-t border-[#252A3E] flex items-center justify-between bg-[#141724]">
                <div>
                  <span className="text-xs text-slate-400">Price:</span>
                  <span className="text-lg font-bold font-serif text-white ml-2">${previewProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewProduct(null)}
                    className="px-4 py-2 rounded-xl bg-[#202538] text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(previewProduct);
                      setPreviewProduct(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#232738] bg-[#0A0C11] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#201D13] border border-[#584B28] flex items-center justify-center text-[#E5C158] font-bold text-xs">
              E
            </div>
            <span className="font-serif font-bold text-slate-200 text-sm">EbookFactory</span>
            <span className="text-slate-600">| Powered by Gemini AI & Cloudflare D1</span>
          </div>

          <div className="flex items-center gap-6">
            {isAdmin && (
              <>
                <button onClick={onLaunchCreatorStudio} className="hover:text-slate-300 transition-colors">Creator Studio</button>
                <button onClick={onNavigateToNiche} className="hover:text-slate-300 transition-colors">Niche Intelligence</button>
              </>
            )}
            <button onClick={onOpenCart} className="hover:text-slate-300 transition-colors">Shopping Cart ({cartCount})</button>
          </div>

          <p>© 2026 EbookFactory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
