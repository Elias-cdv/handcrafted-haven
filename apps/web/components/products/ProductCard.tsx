import Link from 'next/link';
import StarRating from '../ui/StarRating';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  averageRating: number;
  reviewCount: number;
  category: string;
  artisan: { name: string; _id: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  return (
    <article className="card" style={{ overflow: 'hidden' }}>
      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#e5e5c0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {primaryImage?.url ? (
            <img src={primaryImage.url} alt={primaryImage.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="48" height="48" fill="none" stroke="#9ca3af" strokeWidth="1" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
          <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(47,79,79,0.9)', color: '#F5F5DC', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 500, textTransform: 'capitalize' }}>
            {product.category}
          </span>
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            by <span style={{ color: '#2F4F4F', fontWeight: 500 }}>{product.artisan?.name || 'Artisan'}</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <StarRating rating={product.averageRating} size={13} />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({product.reviewCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2F4F4F' }}>${product.price.toFixed(2)}</span>
            <span style={{ fontSize: '0.75rem', color: '#2F4F4F', border: '1px solid #2F4F4F', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>View →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
