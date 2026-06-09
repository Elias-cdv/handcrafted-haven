'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ backgroundColor: '#2F4F4F' }} role="banner">
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }} aria-label="Main navigation">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: '#F5F5DC', fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none' }} aria-label="Handcrafted Haven - Home">
            Handcrafted Haven
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden md:flex">
            <Link href="/products" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.9 }}>Browse</Link>
            <Link href="/artisans" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.9 }}>Artisans</Link>
            <Link href="/login" style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.9 }}>Login</Link>
            <Link href="/register" style={{ backgroundColor: '#E2725B', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
              Join as Artisan
            </Link>
          </div>
          <button onClick={() => setOpen(!open)} style={{ color: '#F5F5DC', background: 'none', border: 'none', cursor: 'pointer', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="md:hidden">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <div id="mobile-menu" style={{ paddingBottom: '1rem', borderTop: '1px solid rgba(245,245,220,0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem' }}>
              {[['Browse', '/products'], ['Artisans', '/artisans'], ['Login', '/login']].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: '#F5F5DC', textDecoration: 'none', padding: '0.5rem 0', opacity: 0.9 }} onClick={() => setOpen(false)}>{label}</Link>
              ))}
              <Link href="/register" style={{ color: '#E2725B', textDecoration: 'none', padding: '0.5rem 0', fontWeight: 500 }} onClick={() => setOpen(false)}>Join as Artisan</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
