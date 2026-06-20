'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, AuthUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== 'artisan') {
      router.push('/login');
      return;
    }
    setUser(u);
  }, [router]);

  if (user === undefined) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <nav style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '2px solid #e5e5c0', paddingBottom: '1rem' }} aria-label="Dashboard navigation">
            <Link href="/dashboard" style={{ color: '#2F4F4F', fontWeight: 600, textDecoration: 'none' }}>My Products</Link>
            <Link href="/dashboard/products/new" style={{ color: '#E2725B', fontWeight: 600, textDecoration: 'none' }}>+ New Product</Link>
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
