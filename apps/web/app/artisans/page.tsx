import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

async function getArtisans() {
  try {
    const res = await fetch(`${API}/artisans`, { cache: 'no-store' });
    return (await res.json()).data || [];
  } catch { return []; }
}

export const metadata = { title: 'Our Artisans', description: 'Discover talented local artisans.' };

export default async function ArtisansPage() {
  const artisans = await getArtisans();
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#2F4F4F', padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F5F5DC', fontSize: '2.5rem' }}>Meet Our Artisans</h1>
          <p style={{ color: 'rgba(245,245,220,0.75)', marginTop: '0.5rem' }}>Talented creators bringing handcrafted excellence to your doorstep</p>
        </div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          {artisans.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
              {artisans.map((a: any) => (
                <Link key={a._id} href={`/artisans/${a._id}`} style={{ textDecoration: 'none' }}>
                  <article className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '88px', height: '88px', borderRadius: '50%', backgroundColor: '#2F4F4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#F5F5DC', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
                      {a.name?.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: '#2F4F4F', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{a.name}</h2>
                    {a.profile?.location && <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>📍 {a.profile.location}</p>}
                    {a.profile?.bio && <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>{a.profile.bio.substring(0, 110)}{a.profile.bio.length > 110 ? '...' : ''}</p>}
                    <p style={{ color: '#E2725B', fontWeight: 500, marginTop: '1rem', fontSize: '0.875rem' }}>View Profile →</p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>No artisans yet. Be the first!</p>
              <Link href="/register" className="btn-primary">Join as Artisan</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
