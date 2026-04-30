import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getBrandBySlug, getProductsByBrandName, type BrandInfo, type Product } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);
  const { isLight, colors: c } = useThemeContext();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const brandData = await getBrandBySlug(id);
      setBrand(brandData || null);
      if (brandData) {
        const brandProducts = await getProductsByBrandName(brandData.name);
        setProducts(brandProducts);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageMeta title="品牌详情 - LIMIN AUDIO" />
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-6" style={{ border: `1px solid ${c.accent}4D`, borderTopColor: c.accent }} />
            <p className="text-sm font-light tracking-[0.3em] uppercase" style={{ color: c.textMuted }}>Loading</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!brand) {
    return (
      <>
        <PageMeta title="品牌未找到 - LIMIN AUDIO" description="抱歉，您访问的品牌不存在" />
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>品牌未找到</h1>
              <p className="text-sm font-light mb-8" style={{ color: c.textMuted }}>抱歉，您访问的品牌不存在或已下架</p>
              <Link to="/brands" className="inline-block px-10 py-3 text-[10px] font-normal tracking-[0.3em] uppercase transition-all duration-700"
                style={{ border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, color: c.text }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${c.accent}4D`; e.currentTarget.style.color = c.accent; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = c.text; }}
              >
                返回品牌中心
              </Link>
            </ScrollAnimation>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${brand.name} - LIMIN AUDIO 立敏音响`}
        description={brand.description || ''}
        keywords={[brand.name, brand.country || '', '音响品牌', 'HIFI', '高端音响']}
      />
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1400px] mx-auto px-8 pt-16 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollAnimation>
                <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                  {brand.image_url ? (
                    <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm font-light tracking-[0.2em]" style={{ color: c.textSub }}>{brand.name}</p>
                    </div>
                  )}
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <div>
                  <p className="text-sm font-medium tracking-[0.3em] uppercase mb-6" style={{ color: c.accent }}>
                    {brand.country}
                  </p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.05em] mb-8" style={{ color: c.text }}>
                    {brand.name}
                  </h1>
                  <div className="w-16 h-px mb-8" style={{ background: `linear-gradient(to right, ${c.accent}66, transparent)` }} />
                  <p className="font-light max-w-lg tracking-[0.05em] text-base leading-relaxed" style={{ color: c.text }}>
                    {brand.description}
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[800px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center gap-6 mb-12">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${c.border})` }} />
                <p className="text-[10px] font-normal tracking-[0.4em] uppercase" style={{ color: `${c.accent}99` }}>Brand Story</p>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${c.border})` }} />
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              <div
                className={`prose prose-lg max-w-none font-light leading-[1.9] tracking-[0.02em] ${isLight ? '' : 'prose-invert'}`}
                style={{ color: c.text }}
                dangerouslySetInnerHTML={{ __html: brand.long_description || '' }}
              />
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center gap-6 mb-12">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${c.border})` }} />
                <p className="text-xs font-medium tracking-[0.4em] uppercase" style={{ color: c.accent }}>代表产品</p>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${c.border})` }} />
              </div>
            </ScrollAnimation>

            {products.length === 0 ? (
              <ScrollAnimation>
                <div className="text-center py-12">
                  <p className="text-sm font-light tracking-[0.2em]" style={{ color: c.textSub }}>该品牌暂无产品</p>
                </div>
              </ScrollAnimation>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.map((product, index) => (
                  <ScrollAnimation key={product.id} delay={index * 100}>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="group block"
                      onMouseOver={() => setHoveredCardId(product.id)}
                      onMouseOut={() => setHoveredCardId(null)}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden mb-6" style={{ backgroundColor: c.bg }}>
                        <img
                          src={product.featured_image_url || '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `linear-gradient(to top, ${c.bg}CC, transparent, transparent)` }} />
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-xs font-light tracking-[0.05em] line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {product.summary}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-normal tracking-[0.08em] transition-colors duration-500"
                          style={{ color: hoveredCardId === product.id ? c.accent : c.text }}>
                          {product.title}
                        </h3>
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: c.accent }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[800px] mx-auto px-8 text-center relative z-10">
            <ScrollAnimation>
              <p className="text-xs font-medium tracking-[0.4em] uppercase mb-6" style={{ color: c.accent }}>
                Contact
              </p>
              <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-[0.05em]" style={{ color: c.text }}>
                对 {brand.name} 感兴趣？
              </h2>
              <p className="font-light max-w-lg mx-auto mb-10 tracking-[0.05em] leading-relaxed" style={{ color: c.textMuted }}>
                我们的专家团队将为您提供详细的品牌介绍和产品推荐
              </p>
              <Link
                to="/contact"
                className="inline-block px-10 py-3.5 text-xs font-medium tracking-[0.3em] uppercase transition-all duration-500"
                style={{ border: `1px solid ${c.borderAccent}`, color: c.accent }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = c.accent; e.currentTarget.style.color = c.ctaText; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = c.accent; }}
              >
                咨询该品牌
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
