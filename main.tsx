import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Download, 
  Search, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { CompletedOrder, StorefrontProduct } from '../types/factory';
import { FEATURED_PRODUCTS } from '../data/mockStorefront';

interface MyLibraryProps {
  orders: CompletedOrder[];
  onNavigateToStorefront: () => void;
}

export const MyLibrary: React.FC<MyLibraryProps> = ({ orders, onNavigateToStorefront }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingBook, setReadingBook] = useState<StorefrontProduct | null>(null);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  // Collect all purchased products across orders + sample purchased item
  const allPurchasedProducts: StorefrontProduct[] = [];
  const addedIds = new Set<string>();

  orders.forEach(o => {
    o.items.forEach(item => {
      if (!addedIds.has(item.product.id)) {
        addedIds.add(item.product.id);
        allPurchasedProducts.push(item.product);
      }
    });
  });

  // Default featured item in library if empty for demo access
  if (allPurchasedProducts.length === 0) {
    allPurchasedProducts.push(FEATURED_PRODUCTS[0]);
  }

  const filtered = allPurchasedProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#232738] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#E5C158] text-xs font-semibold uppercase tracking-widest mb-1">
              <BookMarked className="w-4 h-4 text-[#F0D078]" />
              Personal Digital Library
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">My Purchased Ebooks</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Read online in editorial layout or download EPUB & PDF files anytime.
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161924] border border-[#2B2F42] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5C158]"
            />
          </div>
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-[#131622] border border-[#232738] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#584B28] transition-all shadow-xl"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0F111A]">
                  <img
                    src={product.coverUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-emerald-400 uppercase border border-emerald-800/50 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Purchased
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{product.niche}</span>
                  <h3 className="font-serif font-bold text-lg text-white mt-1 leading-snug">{product.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">By {product.author}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setReadingBook(product)}
                  className="flex-1 py-2.5 rounded-xl bg-[#201D13] border border-[#584B28] text-[#E5C158] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Read Online
                </button>
                <button
                  onClick={() => window.alert(`Downloading PDF for ${product.title}`)}
                  className="p-2.5 rounded-xl bg-[#1D2233] border border-[#3A3F58] text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full Screen Reader Modal */}
        <AnimatePresence>
          {readingBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-50 flex flex-col ${
                readerTheme === 'dark' ? 'bg-[#0F1118] text-slate-200' :
                readerTheme === 'sepia' ? 'bg-[#F4ECD8] text-[#433422]' :
                'bg-white text-slate-900'
              }`}
            >
              {/* Reader Top Bar */}
              <div className={`p-4 border-b flex items-center justify-between ${
                readerTheme === 'dark' ? 'border-slate-800 bg-[#141724]' : 'border-slate-300 bg-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReadingBook(null)}
                    className="p-2 rounded-lg border text-xs font-semibold cursor-pointer"
                  >
                    ← Back to Library
                  </button>
                  <div>
                    <h3 className="font-serif font-bold text-sm">{readingBook.title}</h3>
                    <p className="text-[11px] opacity-70">By {readingBook.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-xs opacity-70">Theme:</span>
                  <button
                    onClick={() => setReaderTheme('dark')}
                    className={`px-3 py-1 rounded-md border text-xs ${readerTheme === 'dark' ? 'bg-[#D4AF37] text-black font-bold' : ''}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setReaderTheme('sepia')}
                    className={`px-3 py-1 rounded-md border text-xs ${readerTheme === 'sepia' ? 'bg-[#433422] text-[#F4ECD8] font-bold' : ''}`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => setReaderTheme('light')}
                    className={`px-3 py-1 rounded-md border text-xs ${readerTheme === 'light' ? 'bg-slate-900 text-white font-bold' : ''}`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Reader Book Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-12 max-w-3xl mx-auto space-y-6 font-serif leading-relaxed text-lg">
                <div className="text-center pb-8 border-b opacity-80">
                  <span className="text-xs font-sans uppercase tracking-widest text-[#D4AF37]">{readingBook.niche}</span>
                  <h1 className="text-3xl font-bold mt-2">{readingBook.title}</h1>
                  <p className="text-sm font-sans mt-1">By {readingBook.author}</p>
                </div>

                <h2 className="text-xl font-bold text-[#D4AF37] font-sans pt-4">{readingBook.sampleChapter.title}</h2>
                <p>{readingBook.sampleChapter.content}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
