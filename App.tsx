import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Library, Menu, Search, ShieldCheck, ShoppingBag, Star, X } from 'lucide-react';
import AdminPanel from './AdminPanel';
import './admin.css';

type ApiProduct = {
  id: string; title: string; slug?: string; description: string;
  price_cents?: number; price?: number; currency?: string;
  cover_url?: string | null; coverUrl?: string | null;
};

type Product = ApiProduct & { price: number; coverUrl?: string };

function normalizeProduct(product: ApiProduct): Product {
  return {
    ...product,
    price: typeof product.price === 'number' ? product.price : Number(product.price_cents || 0) / 100,
    coverUrl: product.coverUrl || product.cover_url || undefined,
  };
}

export default function App() {
  if (window.location.pathname.startsWith('/admin')) return <AdminPanel />;

  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Catalog unavailable')))
      .then(data => setProducts(Array.isArray(data.products) ? data.products.map(normalizeProduct) : []))
      .catch(() => setProducts([]))
      .finally(() => setCatalogLoading(false));
  }, []);

  const filtered = useMemo(() => products.filter(product => {
    const haystack = (product.title + ' ' + product.description).toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [products, query]);

  const total = cart.reduce((sum, product) => sum + product.price, 0);
  const addToCart = (product: Product) => setCart(current => current.some(item => item.id === product.id) ? current : [...current, product]);
  const scrollToStore = () => document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="Ebook Factory home">
          <img src="/brand/ebook-factory-mark.svg" alt="" width="36" height="36" />
          <span>Ebook<span className="brand-accent">Factory</span></span>
        </a>
        <nav className={'nav-links ' + (mobileOpen ? 'open' : '')}>
          <a href="#store" onClick={() => setMobileOpen(false)}>Store</a>
          <a href="#how" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        </nav>
        <div className="nav-actions">
          <button className="cart-button" onClick={() => setShowCart(true)} aria-label="Open shopping cart">
            <Library size={18} /> <span>Library</span>{cart.length > 0 && <b>{cart.length}</b>}
          </button>
          <button className="menu-button" onClick={() => setMobileOpen(value => !value)} aria-label="Toggle navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero storefront-hero">
          <div className="hero-glow" />
          <div className="hero-copy">
            <div className="eyebrow"><ShoppingBag size={15} /> Practical digital books</div>
            <h1>Useful ebooks for your <em>next result.</em></h1>
            <p className="hero-text">Shop focused digital guides designed to help you learn faster, build with confidence, and put ideas into action.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={scrollToStore}>Browse ebooks <ArrowRight size={17} /></button>
            </div>
            <div className="trust-row">
              <span><Check size={14} /> Instant digital access</span>
              <span><ShieldCheck size={14} /> Secure checkout</span>
              <span><Library size={14} /> Customer library</span>
            </div>
          </div>
          <div className="shopper-card">
            <span className="eyebrow">EBOOK FACTORY</span>
            <h2>Read. Apply. Build.</h2>
            <p>Concise, practical resources without filler.</p>
            <div><ShieldCheck size={20} /><span><b>Protected delivery</b><small>Your purchases stay available in your library.</small></span></div>
            <div><ShoppingBag size={20} /><span><b>Digital-first</b><small>Designed for fast access on the devices you use.</small></span></div>
          </div>
        </section>

        <section id="store" className="section store-section">
          <div className="section-heading">
            <div><div className="eyebrow">THE STORE</div><h2>Browse the catalog.</h2><p>Only completed, published ebooks appear here.</p></div>
            <div className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search ebooks..." aria-label="Search ebooks" /></div>
          </div>
          {catalogLoading ? <div className="empty-state">Loading the catalog…</div> :
            filtered.length ? <div className="product-grid">{filtered.map(product =>
              <ProductCard key={product.id} product={product} added={cart.some(item => item.id === product.id)} onAdd={() => addToCart(product)} />
            )}</div> :
            <div className="empty-state">{query ? 'No ebooks matched your search.' : 'New ebooks are being prepared for the store.'}</div>
          }
        </section>

        <section id="how" className="section how-section">
          <div className="section-heading centered"><div><div className="eyebrow">HOW IT WORKS</div><h2>From the shelf to your library.</h2></div></div>
          <div className="steps">
            <Step n="01" title="Choose an ebook" text="Find a practical guide for the result you want." />
            <Step n="02" title="Check out securely" text="Complete your purchase through protected checkout." />
            <Step n="03" title="Read anytime" text="Open your purchased ebooks from your customer library." />
          </div>
        </section>

        <section id="about" className="cta-section">
          <div className="eyebrow">EBOOK FACTORY</div>
          <h2>Practical knowledge, ready when you are.</h2>
          <p>Browse the newest completed releases in the store.</p>
          <button className="button primary" onClick={scrollToStore}>Shop ebooks <ArrowRight size={17} /></button>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img src="/brand/ebook-factory-mark.svg" alt="" width="28" height="28" /><b>EbookFactory</b></div>
        <span>© {new Date().getFullYear()} Ebook Factory</span>
        <a href="mailto:bishopn45@ebookfactory.org">bishopn45@ebookfactory.org</a>
        <span>ebookfactory.org</span>
      </footer>

      {showCart && <div className="modal-backdrop" onClick={() => setShowCart(false)}>
        <aside className="cart-panel" onClick={event => event.stopPropagation()}>
          <div className="cart-header"><div><small>YOUR CART</small><h3>Digital ebooks</h3></div><button onClick={() => setShowCart(false)} aria-label="Close cart"><X /></button></div>
          {cart.length ? <>
            <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><div className="mini-cover">EF</div><div><b>{item.title}</b><span>{formatPrice(item)}</span></div></div>)}</div>
            <div className="cart-total"><span>Total</span><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: cart[0]?.currency || 'USD' }).format(total)}</strong></div>
            <button className="button primary full" onClick={() => alert('Customer checkout is being finalized.')}>Continue to checkout <ArrowRight size={17} /></button>
          </> : <div className="empty-cart"><Library size={30} /><p>Your cart is empty.</p><button className="button secondary" onClick={() => setShowCart(false)}>Continue shopping</button></div>}
        </aside>
      </div>}
    </div>
  );
}

function formatPrice(product: Product) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency || 'USD' }).format(product.price);
}

function ProductCard({ product, added, onAdd }: { product: Product; added: boolean; onAdd: () => void }) {
  return <article className="product-card">
    {product.coverUrl ? <img className="cover-image" src={product.coverUrl} alt={'Cover of ' + product.title} /> :
      <div className="cover"><span>DIGITAL EBOOK</span><strong>{product.title.split(' ').slice(0, 4).join(' ')}</strong><small>EBOOK FACTORY</small></div>}
    <div className="product-info">
      <div className="rating"><Star size={13} fill="currentColor" /> Digital edition</div>
      <h3>{product.title}</h3><p>{product.description}</p>
      <div className="product-bottom"><strong>{formatPrice(product)}</strong><button className={added ? 'added' : ''} onClick={onAdd}>{added ? <><Check size={15} /> Added</> : <>Add to cart <ArrowRight size={15} /></>}</button></div>
    </div>
  </article>;
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return <div className="step"><span>{n}</span><h3>{title}</h3><p>{text}</p></div>;
}
