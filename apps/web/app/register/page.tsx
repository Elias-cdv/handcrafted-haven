'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); return; }
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
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#2F4F4F', fontSize: '2rem', marginBottom: '0.5rem' }}>Join Handcrafted Haven</h1>
            <p style={{ color: '#6b7280' }}>Create your account and start exploring</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            {error && <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="name" style={labelStyle}>Full Name</label>
                <input id="name" type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required autoComplete="name" placeholder="Your name" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="email" style={labelStyle}>Email address</label>
                <input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="email" placeholder="you@example.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="password" style={labelStyle}>Password <span style={{ color: '#6b7280', fontWeight: 400 }}>(min. 8 chars)</span></label>
                <input id="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="new-password" minLength={8} placeholder="••••••••" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={labelStyle}>I want to join as:</legend>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.375rem' }}>
                    {[{ value: 'buyer', icon: '🛍️', label: 'Buyer', desc: 'Browse & buy' }, { value: 'artisan', icon: '🎨', label: 'Artisan', desc: 'Sell my crafts' }].map(opt => (
                      <label key={opt.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', border: `2px solid ${form.role === opt.value ? '#2F4F4F' : '#e5e7eb'}`, borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', backgroundColor: form.role === opt.value ? '#f0f5f5' : 'white', transition: 'all 0.15s' }}>
                        <input type="radio" name="role" value={opt.value} checked={form.role === opt.value} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                        <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{opt.icon}</span>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#1f2937' }}>{opt.label}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }} disabled={loading} aria-busy={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account? <Link href="/login" style={{ color: '#2F4F4F', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
