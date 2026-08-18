import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Library, Menu, Search, ShieldCheck, Sparkles, Star, X, Zap } from 'lucide-react';

type Product = { id: string; title: string; description: string; price: number; currency?: string; category?: string; author?: string; niche?: string; coverUrl?: string; };

const fallbackProducts: Product[] = [
  { id: 'ai-marketing-agency-blueprint', title: 'AI Marketing Agency Blueprint', description: 'A practical operating system for building and selling AI-powered marketing services.', price: 19.99, category: 'Business & Finance', author: 'Ebook Factory', niche: 'AI Marketing' },
  { id: 'deep-sleep-architecture', title: 'The Deep Sleep Architecture', description: 'A practical guide to building better sleep habits, routines, and environments.', price: 19.99, category: 'Health & Longevity', author: 'Ebook Factory', niche: 'Sleep' },
  { id: 'passive-income-real-estate', title: 'Passive Income Real Estate Playbook', description: 'A beginner-friendly framework for evaluating digital and real-estate income opportunities.', price: 24.99, category: 'Business & Finance', author: 'Ebook Factory', niche: 'Passive Income' },
  { id: 'focus-master', title: 'Focus Master', description: 'A concise system for reducing distraction and building consistent deep-work habits.', price: 14.99, category: 'Self-Improvement', author: 'Ebook Factory', niche: 'Productivity' },
];

const categories = ['All', 'Business & Finance', 'Tech & AI', 'Self-Improvement', 'Health & Longevity', 'Fiction & Storytelling'];

export default function App() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('/api/products').then(r => r.ok ? r.json() : Promise.reject()).then(data => Array.isArray(data.products) && data.products.length && setProducts(data.products)).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => products.filter(product => {
    const matchesCategory = category === 'All' || product.category === category;
    const haystack = `${product.title} ${product.description} ${product.author ?? ''} ${product.niche ?? ''}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [products, category, query]);

  const total = cart.reduce((sum, product) => sum + product.price, 0);
  const addToCart = (product: Product) => setCart(current => current.some(item => item.id === product.id) ? current : [...current, product]);
  const scrollToStore = () => document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="Ebook Factory home">
          <img src="/brand/ebook-factory-logo.svg" alt="Ebook Factory — Digital Marketplace" style={{ width: '180px', height: '54px', objectFit: 'contain', display: 'block' }} />
        </a>
        <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <a href="#store" onClick={() => setMobileOpen(false)}>Store</a>
          <a href="#factory" onClick={() => setMobileOpen(false)}>Creator Studio</a>
          <a href="#how" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        </nav>
        <div className="nav-actions">
          <button className="cart-button" onClick={() => setShowCart(true)} aria-label="Open shopping cart"><Library size={18} /> <span>Library</span>{cart.length > 0 && <b>{cart.length}</b>}</button>
          <button className="menu-button" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> AI-assisted digital publishing</div>
            <h1>Turn a good idea into a <em>sellable ebook.</em></h1>
            <p className="hero-text">Research the opportunity, build the manuscript, package the product, and sell it through one professional publishing workspace.</p>
            <div className="hero-actions"><button className="button primary" onClick={scrollToStore}>Browse the store <ArrowRight size={17} /></button><a className="button secondary" href="#factory">Explore the Factory</a></div>
            <div className="trust-row"><span><Check size={14} /> PDF & EPUB ready</span><span><ShieldCheck size={14} /> Secure checkout</span><span><Zap size={14} /> AI-assisted workflow</span></div>
          </div>
          <div className="hero-card"><div className="card-top"><span>FACTORY PIPELINE</span><span className="live-dot">LIVE</span></div>{['Niche opportunity', 'Book outline', 'Manuscript', 'Cover & packaging', 'Store listing'].map((step, i) => <div className="pipeline-step" key={step}><span className="step-number">0{i + 1}</span><span>{step}</span><Check size={15} /></div>)}<div className="pipeline-footer">One workflow. From idea to product.</div></div>
        </section>

        <section className="stats"><div><strong>Research</strong><span>Validate the niche before you write.</span></div><div><strong>Create</strong><span>Build polished books faster.</span></div><div><strong>Package</strong><span>Professional covers and formats.</span></div><div><strong>Sell</strong><span>Own your catalog and customer library.</span></div></section>

        <section id="store" className="section store-section">
          <div className="section-heading"><div><div className="eyebrow">THE MARKETPLACE</div><h2>Books built to be useful.</h2><p>Browse practical digital products created for people who want an actionable result, not filler.</p></div><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search books..." aria-label="Search books" /></div></div>
          <div className="category-row">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} added={cart.some(item => item.id === product.id)} onAdd={() => addToCart(product)} />)}</div>
          {!filtered.length && <div className="empty-state">No books matched your search.</div>}
        </section>

        <section id="factory" className="section factory-section"><div className="factory-panel"><div className="factory-copy"><div className="eyebrow">THE EBOOK FACTORY</div><h2>Build the business behind the book.</h2><p>The Factory is designed around the entire publishing lifecycle instead of stopping at AI text generation.</p><div className="feature-list"><div><Sparkles /><span><b>Niche Intelligence</b><small>Identify commercially useful topics and buyer intent.</small></span></div><div><BookOpen /><span><b>Creator Studio</b><small>Develop, edit, organize, and package the manuscript.</small></span></div><div><Zap /><span><b>Publishing Pipeline</b><small>Move finished books toward your storefront and distribution workflow.</small></span></div></div><button className="button primary" onClick={() => alert('Creator Studio is reserved for authenticated creators.')}>Open Creator Studio <ArrowRight size={17} /></button></div><div className="factory-visual"><div className="visual-header">PROJECT STATUS <span>READY</span></div><div className="visual-book"><div className="book-cover"><span>YOUR<br />NEXT<br /><strong>BOOK</strong></span></div><div><small>PROJECT</small><h3>From niche to published product</h3><div className="progress"><span style={{ width: '78%' }} /></div><p>78% complete</p></div></div></div></div></section>

        <section id="how" className="section how-section"><div className="section-heading centered"><div><div className="eyebrow">HOW IT WORKS</div><h2>A publishing system, not just a writer.</h2></div></div><div className="steps"><Step n="01" title="Find the opportunity" text="Use niche intelligence to start with a commercially relevant idea." /><Step n="02" title="Create the product" text="Turn the idea into a structured, editable manuscript and polished package." /><Step n="03" title="Sell and deliver" text="List the product, collect payment, and deliver authorized digital files." /></div></section>

        <section id="about" className="cta-section"><div className="eyebrow">EBOOK FACTORY</div><h2>Your next digital product starts here.</h2><p>Research smarter. Create faster. Build a catalog you own.</p><button className="button primary" onClick={scrollToStore}>Start browsing <ArrowRight size={17} /></button></section>
      </main>

      <footer><div className="footer-brand"><img src="/brand/ebook-factory-mark.svg" alt="" aria-hidden="true" style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'block' }} /><b>Ebook Factory</b></div><span>© {new Date().getFullYear()} Ebook Factory</span><a href="mailto:bishopn45@ebookfactory.org">bishopn45@ebookfactory.org</a><span>ebookfactory.org</span></footer>

      {showCart && <div className="modal-backdrop" onClick={() => setShowCart(false)}><aside className="cart-panel" onClick={e => e.stopPropagation()}><div className="cart-header"><div><small>YOUR CART</small><h3>Digital products</h3></div><button onClick={() => setShowCart(false)} aria-label="Close cart"><X /></button></div>{cart.length ? <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><div className="mini-cover">EF</div><div><b>{item.title}</b><span>${item.price.toFixed(2)}</span></div></div>)}</div><div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="button primary full" onClick={() => alert('Checkout is connected to the production PayPal API after authentication and deployment secrets are configured.')}>Continue to checkout <ArrowRight size={17} /></button></> : <div className="empty-cart"><Library size={30} /><p>Your cart is empty.</p><button className="button secondary" onClick={() => setShowCart(false)}>Continue shopping</button></div>}</aside></div>}
    </div>
  );
}

function ProductCard({ product, added, onAdd }: { product: Product; added: boolean; onAdd: () => void }) { return <article className="product-card"><div className="cover"><div className="cover-shine" /><span>{product.category?.split(' ')[0] ?? 'BOOK'}</span><strong>{product.title.split(' ').slice(0, 3).join(' ')}</strong><small>EBOOK FACTORY</small></div><div className="product-info"><div className="rating"><Star size={13} fill="currentColor" /> 4.9 <span>• Digital edition</span></div><h3>{product.title}</h3><p>{product.description}</p><div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><button className={added ? 'added' : ''} onClick={onAdd}>{added ? <><Check size={15} /> Added</> : <>Add to cart <ArrowRight size={15} /></>}</button></div></div></article>; }
function Step({ n, title, text }: { n: string; title: string; text: string }) { return <div className="step"><span>{n}</span><h3>{title}</h3><p>{text}</p></div>; }
