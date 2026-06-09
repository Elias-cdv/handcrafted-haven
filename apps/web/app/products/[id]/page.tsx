import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

async function getReviews(id: string) {
  try {
    const res = await fetch(`${API}/reviews/product/${id}`, { cache: 'no-store' });
    return (await res.json()).data || [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.title || 'Product Not Found', description: product?.description?.substring(0, 160) };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([getProduct(id), getReviews(id)]);
  if (!product) notFound();

  const image = product.images?.find((i: any) => i.isPrimary) || product.images?.[0];

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }}>
              <li><Link href="/" style={{ color: '#2F4F4F', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden>›</li>
              <li><Link href="/products" style={{ color: '#2F4F4F', textDecoration: 'none' }}>Products</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page">{product.title}</li>
            </ol>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#e5e5c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {image?.url ? (
                <img src={image.url} alt={image.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="80" height="80" fill="none" stroke="#9ca3af" strokeWidth="1" viewBox="0 0 24 24" aria-label="No image available">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </div>

            <div>
              <span style={{ backgroundColor: '#2F4F4F', color: '#F5F5DC', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                {product.category}
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1f2937', margin: '0.75rem 0' }}>{product.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <StarRating rating={product.averageRating} size={20} />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'No reviews'}{product.reviewCount > 0 ? ` (${product.reviewCount})` : ''}
                </span>
              </div>
              <p style={{ fontSize: '2.25rem', fontWeight: 700, color: '#2F4F4F', marginBottom: '1.5rem' }}>${product.price.toFixed(2)}</p>
              <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>

              {product.artisan && (
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e5c0', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Created by</p>
                  <Link href={`/artisans/${product.artisan._id}`} style={{ color: '#2F4F4F', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>
                    {product.artisan.name} →
                  </Link>
                </div>
              )}

              {product.materials?.length > 0 && (
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
                  <strong>Materials:</strong> {product.materials.join(', ')}
                </p>
              )}
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: product.isAvailable ? '#16a34a' : '#dc2626' }}>
                <strong style={{ color: '#374151' }}>Availability:</strong> {product.isAvailable ? `In Stock (${product.stock})` : 'Out of Stock'}
              </p>

              <button className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '1rem', justifyContent: 'center' }} disabled={!product.isAvailable}>
                {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>

          <section aria-label="Customer reviews">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#2F4F4F', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e5e5c0' }}>
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map((r: any) => (
                  <article key={r._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e5c0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ color: '#1f2937' }}>{r.author?.name || 'Anonymous'}</strong>
                        <div style={{ marginTop: '0.25rem' }}><StarRating rating={r.rating} size={14} /></div>
                      </div>
                      <time style={{ fontSize: '0.8rem', color: '#9ca3af' }} dateTime={r.createdAt}>
                        {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </div>
                    <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{r.title}</h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.9rem' }}>{r.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', padding: '2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '0.75rem' }}>
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
