import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Check, LogIn, LogOut, Pencil, Plus, Save, ShieldCheck } from 'lucide-react';

type AdminProduct = {
  id: string; title: string; slug: string; description: string; price_cents: number;
  currency: string; cover_url: string | null; pdf_key: string | null; epub_key: string | null;
  status: 'draft' | 'published' | 'archived';
};

const emptyProduct: AdminProduct = {
  id: '', title: '', slug: '', description: '', price_cents: 1999, currency: 'USD',
  cover_url: '', pdf_key: '', epub_key: '', status: 'draft',
};

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem('ebook-factory-admin-token') || '');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<AdminProduct>(emptyProduct);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const request = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  };

  const loadProducts = async () => {
    const data = await request('/api/admin/products');
    setProducts(Array.isArray(data.products) ? data.products : []);
  };

  useEffect(() => {
    if (!token) return;
    loadProducts().catch(error => { sessionStorage.removeItem('ebook-factory-admin-token'); setToken(''); setMessage(error.message); });
  }, [token]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const configResponse = await fetch('/api/auth/config');
      const config = await configResponse.json();
      if (!configResponse.ok || !config.firebaseApiKey) throw new Error('Admin sign-in is not configured yet.');
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + encodeURIComponent(config.firebaseApiKey), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login.email, password: login.password, returnSecureToken: true }),
      });
      const data = await response.json();
      if (!response.ok || !data.idToken) throw new Error('Email or password was not accepted.');
      sessionStorage.setItem('ebook-factory-admin-token', data.idToken);
      setToken(data.idToken);
      setMessage('Admin access granted.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to sign in.'); }
    finally { setBusy(false); }
  };

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      if (!form.id.trim()) throw new Error('A stable product ID is required.');
      await request('/api/admin/products/' + encodeURIComponent(form.id.trim()), { method: 'PUT', body: JSON.stringify(form) });
      await loadProducts(); setForm(emptyProduct); setMessage('Catalog entry saved.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save the catalog entry.'); }
    finally { setBusy(false); }
  };

  const signOut = () => { sessionStorage.removeItem('ebook-factory-admin-token'); setToken(''); setProducts([]); setForm(emptyProduct); };

  if (!token) return <main className="admin-shell login-shell">
    <section className="admin-login">
      <img src="/brand/ebook-factory-mark.svg" alt="" width="48" height="48" />
      <div className="admin-kicker"><ShieldCheck size={15} /> PRIVATE BUSINESS AREA</div>
      <h1>Factory Admin</h1>
      <p>Sign in to manage completed ebooks and control what appears in the public storefront.</p>
      <form onSubmit={signIn}>
        <label>Email<input type="email" autoComplete="username" value={login.email} onChange={event => setLogin({ ...login, email: event.target.value })} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={login.password} onChange={event => setLogin({ ...login, password: event.target.value })} required /></label>
        <button className="button primary full" disabled={busy}><LogIn size={17} /> {busy ? 'Signing in…' : 'Admin login'}</button>
      </form>
      {message && <p className="admin-message">{message}</p>}
      <a href="/">← Return to storefront</a>
    </section>
  </main>;

  return <main className="admin-shell">
    <header className="admin-header">
      <div><div className="admin-kicker"><ShieldCheck size={14} /> AUTHORIZED ADMIN</div><h1>Factory publishing</h1><p>Move completed ebook generation into the public storefront.</p></div>
      <div className="admin-header-actions"><a className="button secondary" href="/">View storefront</a><button className="button secondary" onClick={signOut}><LogOut size={16} /> Sign out</button></div>
    </header>
    {message && <div className="admin-notice">{message}</div>}
    <div className="admin-grid">
      <section className="admin-card">
        <div className="admin-card-title"><Plus size={18} /><div><h2>{form.id ? 'Edit catalog entry' : 'Add completed ebook'}</h2><p>Drafts stay private. Publishing makes the ebook visible to customers.</p></div></div>
        <form className="product-form" onSubmit={saveProduct}>
          <div className="form-row"><label>Product ID<input value={form.id} onChange={event => setForm({ ...form, id: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="stable-product-id" required /></label><label>Slug<input value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="store-url-slug" required /></label></div>
          <label>Title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required /></label>
          <label>Description<textarea rows={4} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required /></label>
          <div className="form-row"><label>Price (cents)<input type="number" min="0" value={form.price_cents} onChange={event => setForm({ ...form, price_cents: Number(event.target.value) })} required /></label><label>Currency<input value={form.currency} maxLength={3} onChange={event => setForm({ ...form, currency: event.target.value.toUpperCase() })} required /></label><label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as AdminProduct['status'] })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div>
          <label>Cover image URL<input type="url" value={form.cover_url || ''} onChange={event => setForm({ ...form, cover_url: event.target.value })} placeholder="https://…" /></label>
          <div className="form-row"><label>PDF file key<input value={form.pdf_key || ''} onChange={event => setForm({ ...form, pdf_key: event.target.value })} placeholder="completed/book.pdf" /></label><label>EPUB file key<input value={form.epub_key || ''} onChange={event => setForm({ ...form, epub_key: event.target.value })} placeholder="completed/book.epub" /></label></div>
          <div className="form-actions"><button type="button" className="button secondary" onClick={() => setForm(emptyProduct)}>Clear</button><button className="button primary" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save ebook'}</button></div>
        </form>
      </section>
      <section className="admin-card">
        <div className="admin-card-title"><BookOpen size={18} /><div><h2>Store catalog</h2><p>{products.length} entries across draft, published, and archived states.</p></div></div>
        <div className="admin-products">{products.map(product => <article key={product.id} className="admin-product">
          <div><span className={'status-pill ' + product.status}>{product.status === 'published' && <Check size={12} />}{product.status}</span><h3>{product.title}</h3><p>{product.description}</p><small>{product.currency} {(product.price_cents / 100).toFixed(2)} · {product.pdf_key || product.epub_key ? 'Files attached' : 'No files attached'}</small></div>
          <button className="icon-button" onClick={() => setForm({ ...product })} aria-label={'Edit ' + product.title}><Pencil size={16} /></button>
        </article>)}
        {!products.length && <div className="admin-empty">No catalog entries yet. Add the first completed ebook.</div>}</div>
      </section>
    </div>
  </main>;
}
