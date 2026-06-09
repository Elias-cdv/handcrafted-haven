import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2F4F4F', color: '#F5F5DC', padding: '3rem 0 1.5rem' }} role="contentinfo">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Handcrafted Haven</h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.75, lineHeight: 1.6 }}>A marketplace celebrating local artisans and handcrafted goods.</p>
          </div>
          <nav aria-label="Explore">
            <h3 style={{ fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.75rem' }}>Explore</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['All Products', '/products'], ['Artisans', '/artisans']].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.8 }}>{label}</Link>
              ))}
            </div>
          </nav>
          <nav aria-label="Account">
            <h3 style={{ fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.75rem' }}>Account</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['Login', '/login'], ['Register', '/register']].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: '#F5F5DC', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.8 }}>{label}</Link>
              ))}
            </div>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(245,245,220,0.15)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>© {new Date().getFullYear()} Handcrafted Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
