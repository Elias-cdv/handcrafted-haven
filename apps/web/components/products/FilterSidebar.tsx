'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['ceramics','jewelry','textiles','woodwork','painting','glasswork','leatherwork','candles','other'];

interface Props {
  currentCategory?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSearch?: string;
}

export default function FilterSidebar({ currentCategory, currentMinPrice, currentMaxPrice, currentSearch }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch || '');
  const [minPrice, setMinPrice] = useState(currentMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || '');

  const apply = (cat?: string) => {
    const p = new URLSearchParams();
    const category = cat !== undefined ? cat : (currentCategory || '');
    if (category) p.set('category', category);
    if (search) p.set('search', search);
    if (minPrice) p.set('minPrice', minPrice);
    if (maxPrice) p.set('maxPrice', maxPrice);
    router.push(`/products?${p.toString()}`);
  };

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block' as const, fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e5c0' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#2F4F4F', marginBottom: '1.5rem' }}>Filters</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="filter-search" style={labelStyle}>Search</label>
        <input id="filter-search" type="search" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && apply()} placeholder="Search products..." style={inputStyle} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.75rem' }}>Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }} role="group" aria-label="Filter by category">
          <button onClick={() => apply('')} aria-pressed={!currentCategory} style={{ textAlign: 'left', padding: '0.375rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer', border: 'none', backgroundColor: !currentCategory ? '#2F4F4F' : 'transparent', color: !currentCategory ? '#F5F5DC' : '#4b5563', fontWeight: !currentCategory ? 600 : 400 }}>
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => apply(cat)} aria-pressed={currentCategory === cat} style={{ textAlign: 'left', padding: '0.375rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer', border: 'none', textTransform: 'capitalize', backgroundColor: currentCategory === cat ? '#2F4F4F' : 'transparent', color: currentCategory === cat ? '#F5F5DC' : '#4b5563', fontWeight: currentCategory === cat ? 600 : 400 }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.75rem' }}>Price Range</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="min-price" style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Min ($)</label>
            <input id="min-price" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" placeholder="0" style={inputStyle} />
          </div>
          <span style={{ color: '#6b7280', paddingBottom: '0.5rem' }}>–</span>
          <div style={{ flex: 1 }}>
            <label htmlFor="max-price" style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Max ($)</label>
            <input id="max-price" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" placeholder="∞" style={inputStyle} />
          </div>
        </div>
      </div>

      <button onClick={() => apply()} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Apply Filters</button>
      <a href="/products" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280', textDecoration: 'underline' }}>Clear all filters</a>
    </div>
  );
}
