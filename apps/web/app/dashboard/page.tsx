'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUser, getToken } from '@/lib/auth';

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  category: string;
  images: { url: string; alt: string }[];
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const user = getUser();
    if (!user) return;
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${API}/products?artisan=${user.id}&limit=100`);
      const data = await res.json();
      setProducts(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const token = getToken();
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  if (loading) return <p style={{ color: '#6b7280' }}>Loading your products...</p>;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#2F4F4F', marginBottom: '1.5rem' }}>
        My Products ({products.length})
      </h1>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You haven't listed any products yet.</p>
          <Link href="/dashboard/products/new" className="btn-primary">Create Your First Product</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map(p => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e5c0', flexWrap: 'wrap' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '0.5rem', backgroundColor: '#e5e5c0', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.images[0].alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>📦</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ fontWeight: 600, color: '#1f2937' }}>{p.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'capitalize' }}>{p.category} · Stock: {p.stock}</p>
              </div>
              <p style={{ fontWeight: 700, color: '#2F4F4F', fontSize: '1.1rem' }}>${p.price.toFixed(2)}</p>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', backgroundColor: p.isAvailable ? '#dcfce7' : '#fee2e2', color: p.isAvailable ? '#16a34a' : '#dc2626' }}>
                {p.isAvailable ? 'Active' : 'Inactive'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/dashboard/products/${p._id}/edit`} style={{ padding: '0.5rem 1rem', border: '1px solid #2F4F4F', color: '#2F4F4F', borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.85rem' }}>Edit</Link>
                <button onClick={() => handleDelete(p._id)} style={{ padding: '0.5rem 1rem', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '0.375rem', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
