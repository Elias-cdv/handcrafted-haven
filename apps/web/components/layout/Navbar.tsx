'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ backgroundColor: '#2F4F4F' }} role="banner">
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }} aria-label="Main navigation">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: '#F5F5DC', fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none' }}>
            Handcrafted Haven
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/products" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Browse</Link>
            <Link href="/artisans" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Artisans</Link>
            <Link href="/login" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
            <Link href="/register" style={{ backgroundColor: '#E2725B', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
              Join as Artisan
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
