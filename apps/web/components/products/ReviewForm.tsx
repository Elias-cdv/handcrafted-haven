'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, getUser, AuthUser } from '@/lib/auth';

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = getToken();
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${API}/reviews/product/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to submit review'); return; }
      setSuccess(true);
      setTitle('');
      setBody('');
      router.refresh();
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block' as const, fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' };

  if (!user) {
    return (
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid #e5e5c0' }}>
        <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>Want to share your thoughts on this product?</p>
        <Link href="/login" className="btn-outline" style={{ color: '#2F4F4F' }}>Login to Write a Review</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div role="status" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem 1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
        ✓ Thank you! Your review has been submitted.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #e5e5c0' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#2F4F4F', marginBottom: '1rem' }}>Write a Review</h3>
      {error && <div role="alert" style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.625rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="rating" style={labelStyle}>Rating</label>
          <select id="rating" value={rating} onChange={e => setRating(Number(e.target.value))} style={{ ...inputStyle, maxWidth: '160px' }}>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="review-title" style={labelStyle}>Title</label>
          <input id="review-title" required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience" style={inputStyle} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="review-body" style={labelStyle}>Your Review</label>
          <textarea id="review-body" required rows={4} maxLength={1500} value={body} onChange={e => setBody(e.target.value)} placeholder="Share details about your experience" style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
      </form>
    </div>
  );
}
