'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUser, logout, AuthUser } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header style={{ backgroundColor: '#2F4F4F' }} role="banner">
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }} aria-label="Main navigation">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: '#F5F5DC', fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none' }}>
            Handcrafted Haven
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/products" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Browse</Link>
            <Link href="/artisans" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Artisans</Link>

            {user ? (
              <>
                {user.role === 'artisan' && (
                  <Link href="/dashboard" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
                )}
                <span style={{ color: 'rgba(245,245,220,0.7)', fontSize: '0.85rem' }}>Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(245,245,220,0.4)', color: '#F5F5DC', padding: '0.4rem 0.9rem', borderRadius: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', minHeight: '38px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
                <Link href="/register" style={{ backgroundColor: '#E2725B', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
                  Join as Artisan
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
