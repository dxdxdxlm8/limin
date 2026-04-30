import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getBrands, getProductsByBrandName, type BrandInfo, type Product } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function Brands() {
  const [brands, setBrands] = useState<(BrandInfo & {products: Product[];})[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors: c } = useThemeContext();

  useEffect(() => {
    async function fetchData() {
      const brandsData = await getBrands();
      const brandsWithProducts = await Promise.all(
        brandsData.map(async (brand) => {
          const products = await getProductsByBrandName(brand.name, 2);
          return { ...brand, products };
        })
      );
      setBrands(brandsWithProducts);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PageMeta title="品牌中心 - LIMIN AUDIO 立敏音响" />
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

  return (
    <>
      <PageMeta
        title="品牌中心 - LIMIN AUDIO 立敏音响"
        description="了解 LIMIN AUDIO 代理的全球顶级音响品牌，包括 Ayon Audio、BAT、Benchmark、Ryan 等"
        keywords={['音响品牌', 'Ayon Audio', 'BAT', 'Benchmark', '高端音响', 'HIFI 品牌']}
      />

      <Header />
      <main className="pt-20">
        <section className="relative py-12 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-[10px] font-normal tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                Global Brands
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.1em] mb-4" style={{ color: c.text }}>
                品牌中心
              </h1>
              <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              <p className="font-light max-w-xl mx-auto tracking-[0.05em] text-base leading-relaxed" style={{ color: c.textMuted }}>
                精选全球顶级音响品牌，每一品牌都代表行业最高水准
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="space-y-32">
              {brands.map((brand, index) => (
                <ScrollAnimation key={brand.id} delay={index * 100}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start`}>
                    <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <Link to={`/brand/${brand.slug}`} className="block group relative overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {brand.image_url ? (
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: c.textSub }}>
                              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-sm font-light tracking-[0.2em] uppercase">{brand.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-6 left-6">
                          <span className="text-xs font-medium tracking-[0.3em] uppercase px-3 py-1.5" style={{ color: c.accent, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                            {brand.country}
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} flex flex-col justify-center`}>
                      <Link to={`/brand/${brand.slug}`} className="group block">
                        <h2 className="text-5xl md:text-6xl font-extralight mb-6 tracking-[0.03em] transition-colors duration-700" style={{ color: c.text }}
                          onMouseOver={e => e.currentTarget.style.color = c.accent}
                          onMouseOut={e => e.currentTarget.style.color = c.text}
                        >
                          {brand.name}
                        </h2>

                        <div className="w-12 h-px mb-8" style={{ background: `linear-gradient(to right, ${c.accent}, transparent)` }} />

                        <div
                          className="font-light mb-10 tracking-[0.02em] text-base leading-[1.9] line-clamp-5"
                          style={{ color: c.textMuted }}
                          dangerouslySetInnerHTML={{ __html: brand.long_description || brand.description || '' }}
                        />

                        <div className="inline-flex items-center text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 group-hover:gap-4" style={{ color: c.accent }}>
                          <span>探索品牌</span>
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </Link>

                      {brand.products.length > 0 && (
                        <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${c.border}` }}>
                          <p className="text-[10px] font-medium tracking-[0.3em] uppercase mb-5" style={{ color: `${c.accent}99` }}>
                            代表产品
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            {brand.products.map((product) => (
                              <Link
                                key={product.id}
                                to={`/product/${product.slug || product.id}`}
                                className="group/product block"
                              >
                                <div className="relative aspect-square overflow-hidden mb-2" style={{ backgroundColor: c.bgAlt }}>
                                  <img
                                    src={product.featured_image_url || '/placeholder.svg'}
                                    alt={product.title}
                                    className="w-full h-full object-cover opacity-80 group-hover/product:opacity-100 group-hover/product:scale-105 transition-all duration-700"
                                  />
                                </div>
                                <p className="font-light tracking-[0.03em] text-xs truncate" style={{ color: c.textSub }}>
                                  {product.title}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[800px] mx-auto px-8 text-center relative z-10">
            <ScrollAnimation>
              <p className="text-xs font-medium tracking-[0.4em] uppercase mb-6" style={{ color: c.accent }}>
                Contact
              </p>
              <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-[0.05em]" style={{ color: c.text }}>
                对某个品牌感兴趣？
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
                咨询我们
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
