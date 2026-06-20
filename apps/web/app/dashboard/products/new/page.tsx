'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

const CATEGORIES = ['ceramics','jewelry','textiles','woodwork','painting','glasswork','leatherwork','candles','other'];

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'other', stock: '1',
    imageUrl: '', imageAlt: '', materials: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = { width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block' as const, fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = getToken();
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const body = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        materials: form.materials.split(',').map(m => m.trim()).filter(Boolean),
        images: form.imageUrl ? [{ url: form.imageUrl, alt: form.imageAlt || form.title, isPrimary: true }] : [],
      };
      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to create product'); return; }
      router.push('/dashboard');
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#2F4F4F', marginBottom: '1.5rem' }}>New Product</h1>
      <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
        {error && <div role="alert" style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="title" style={labelStyle}>Product Title</label>
            <input id="title" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="description" style={labelStyle}>Description</label>
            <textarea id="description" required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' as const }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label htmlFor="price" style={labelStyle}>Price ($)</label>
              <input id="price" type="number" step="0.01" min="0.01" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="stock" style={labelStyle}>Stock</label>
              <input id="stock" type="number" min="0" required value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="category" style={labelStyle}>Category</label>
            <select id="category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="materials" style={labelStyle}>Materials <span style={{ fontWeight: 400, color: '#6b7280' }}>(comma separated)</span></label>
            <input id="materials" placeholder="clay, glaze, wood" value={form.materials} onChange={e => setForm(p => ({ ...p, materials: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="imageUrl" style={labelStyle}>Image URL <span style={{ fontWeight: 400, color: '#6b7280' }}>(optional)</span></label>
            <input id="imageUrl" type="url" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="imageAlt" style={labelStyle}>Image Alt Text <span style={{ fontWeight: 400, color: '#6b7280' }}>(for accessibility)</span></label>
            <input id="imageAlt" placeholder="Describe the image" value={form.imageAlt} onChange={e => setForm(p => ({ ...p, imageAlt: e.target.value }))} style={inputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
