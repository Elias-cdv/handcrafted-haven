'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      router.push('/');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block' as const, fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' };

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#2F4F4F', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: '#6b7280' }}>Sign in to your account</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            {error && <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="email" style={labelStyle}>Email address</label>
                <input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="email" placeholder="you@example.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input id="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="current-password" placeholder="••••••••" style={inputStyle} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }} disabled={loading} aria-busy={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Don't have an account? <Link href="/register" style={{ color: '#2F4F4F', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
