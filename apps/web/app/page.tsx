import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API}/products?limit=8`, { cache: 'no-store' });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getFeaturedArtisans() {
  try {
    const res = await fetch(`${API}/artisans`, { cache: 'no-store' });
    const data = await res.json();
    return (data.data || []).slice(0, 4);
  } catch { return []; }
}

const CATEGORY_ICONS: Record<string, string> = { ceramics: '🏺', jewelry: '💎', textiles: '🧵', woodwork: '🪵', painting: '🎨', candles: '🕯️' };

export default async function HomePage() {
  const [products, artisans] = await Promise.all([getFeaturedProducts(), getFeaturedArtisans()]);

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section style={{ backgroundColor: '#2F4F4F', color: '#F5F5DC', padding: '6rem 1.5rem', textAlign: 'center' }} aria-label="Hero">
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Discover Handcrafted Treasures
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', opacity: 0.85, marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Connect with local artisans and find unique, handmade pieces crafted with passion.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Shop Now</Link>
              <Link href="/artisans" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.875rem 2rem', border: '2px solid #F5F5DC', color: '#F5F5DC', borderRadius: '0.5rem', fontWeight: 500, textDecoration: 'none', fontSize: '1rem', minHeight: '44px' }}>Meet Artisans</Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }} aria-label="Browse by category">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#2F4F4F', textAlign: 'center', marginBottom: '2rem' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
              <Link key={cat} href={`/products?category=${cat}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 1rem', backgroundColor: 'white', borderRadius: '0.75rem', textDecoration: 'none', color: '#2F4F4F', fontWeight: 500, textTransform: 'capitalize', fontSize: '0.875rem', border: '1px solid #e5e5c0', textAlign: 'center', transition: 'box-shadow 0.2s' }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</span>
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={{ padding: '2rem 1.5rem 4rem', backgroundColor: 'white' }} aria-label="Featured products">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#2F4F4F' }}>Featured Products</h2>
              <Link href="/products" style={{ color: '#E2725B', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>View All →</Link>
            </div>
            {products.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                <p style={{ marginBottom: '1.5rem' }}>No products yet. Be the first artisan to list your crafts!</p>
                <Link href="/register" className="btn-primary">Join as Artisan</Link>
              </div>
            )}
          </div>
        </section>

        {/* Artisans */}
        {artisans.length > 0 && (
          <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }} aria-label="Featured artisans">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#2F4F4F', textAlign: 'center', marginBottom: '2rem' }}>Meet Our Artisans</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
              {artisans.map((a: any) => (
                <Link key={a._id} href={`/artisans/${a._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#2F4F4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#F5F5DC', fontSize: '1.75rem', fontFamily: 'var(--font-heading)' }}>
                      {a.name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#2F4F4F', marginBottom: '0.25rem', fontSize: '1rem' }}>{a.name}</h3>
                    {a.profile?.location && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>📍 {a.profile.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ backgroundColor: '#E2725B', padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>Are You an Artisan?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.1rem' }}>Share your handcrafted creations with the world.</p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.875rem 2rem', backgroundColor: 'white', color: '#E2725B', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
            Start Selling Today
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
