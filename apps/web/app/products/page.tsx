import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/products/FilterSidebar';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

interface SearchParams { category?: string; minPrice?: string; maxPrice?: string; search?: string; page?: string; }

async function getProducts(p: SearchParams) {
  const q = new URLSearchParams();
  if (p.category) q.set('category', p.category);
  if (p.minPrice) q.set('minPrice', p.minPrice);
  if (p.maxPrice) q.set('maxPrice', p.maxPrice);
  if (p.search) q.set('search', p.search);
  q.set('page', p.page || '1');
  q.set('limit', '12');
  try {
    const res = await fetch(`${API}/products?${q}`, { cache: 'no-store' });
    return await res.json();
  } catch { return { data: [], total: 0, pages: 1 }; }
}

export const metadata = { title: 'All Products' };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { data: products = [], total = 0, pages = 1 } = await getProducts(params);
  const currentPage = Number(params.page) || 1;

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#2F4F4F', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F5F5DC', fontSize: '2.5rem' }}>
              {params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : 'All Products'}
            </h1>
            <p style={{ color: 'rgba(245,245,220,0.75)', marginTop: '0.5rem' }}>{total} item{total !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <aside style={{ width: '260px', flexShrink: 0, minWidth: '200px' }} aria-label="Product filters">
            <FilterSidebar currentCategory={params.category} currentMinPrice={params.minPrice} currentMaxPrice={params.maxPrice} currentSearch={params.search} />
          </aside>

          <div style={{ flex: 1, minWidth: '280px' }}>
            {products.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
                  {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
                      <a key={page} href={`/products?${new URLSearchParams({ ...params, page: String(page) })}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', backgroundColor: page === currentPage ? '#2F4F4F' : 'white', color: page === currentPage ? '#F5F5DC' : '#2F4F4F', border: '1px solid #2F4F4F', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                        {page}
                      </a>
                    ))}
                  </nav>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>No products found.</p>
                <a href="/products" className="btn-primary">Clear Filters</a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
