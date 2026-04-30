import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getProducts, getProductCategories, type Product, type ProductCategory } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors: c } = useThemeContext();
  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(50),
        getProductCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = selectedCategoryId
    ? products.filter((p) => String(p.category_id) === selectedCategoryId)
    : products;

  const selectedCategoryName = selectedCategoryId
    ? categories.find((cat) => String(cat.id) === selectedCategoryId)?.name
    : null;

  if (loading) {
    return (
      <>
        <PageMeta title="产品中心 - LIMIN AUDIO 立敏音响" />
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
        title="产品中心 - LIMIN AUDIO 立敏音响"
        description="探索 LIMIN AUDIO 代理的顶级 HIFI 音响产品，包括解码器、数字播放器、黑胶唱机、扬声器等"
        keywords={['HIFI 音响', '解码器', '数字播放器', '扬声器', '高端音响']}
      />

      <Header />
      <main className="pt-20">
        <section className="relative py-12 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-[10px] font-normal tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                Our Products
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.1em] mb-4" style={{ color: c.text }}>
                产品中心
              </h1>
              <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              <p className="font-light max-w-xl mx-auto tracking-[0.05em] text-base leading-relaxed" style={{ color: c.textMuted }}>
                精选全球顶级音响产品，每一款都代表行业最高水准
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-4 border-b" style={{ backgroundColor: c.bg, borderColor: c.border }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="px-5 py-2 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-500 border"
                  style={{
                    color: !selectedCategoryId ? c.accent : c.textSub,
                    borderColor: !selectedCategoryId ? c.borderAccent : 'transparent',
                  }}
                >
                  全部
                </Link>
                {categories.map((category) => {
                  const isSelected = selectedCategoryId === String(category.id);
                  return (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="px-5 py-2 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-500 border"
                      style={{
                        color: isSelected ? c.accent : c.textSub,
                        borderColor: isSelected ? c.borderAccent : 'transparent',
                      }}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-8" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1400px] mx-auto px-8">
            {selectedCategoryName && (
              <div className="mb-10">
                <ScrollAnimation>
                  <p className="text-[10px] font-normal tracking-[0.3em] uppercase mb-2" style={{ color: `${c.accent}99` }}>
                    Current Category
                  </p>
                  <h2 className="text-3xl font-extralight tracking-[0.05em]" style={{ color: c.text }}>{selectedCategoryName}</h2>
                </ScrollAnimation>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-sm font-light tracking-[0.2em]" style={{ color: c.textSub }}>该分类下暂无产品</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <ScrollAnimation key={product.id} delay={index * 80}>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden mb-6" style={{ backgroundColor: c.bgAlt }}>
                        <img
                          src={product.featured_image_url || '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `linear-gradient(to top, ${c.bg}CC, transparent, transparent)` }}
                        />
                        {product.brand_name && (
                          <div className="absolute top-4 left-4 px-3 py-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: c.accent }}>
                              {product.brand_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3
                          className="text-lg font-extralight mb-3 tracking-[0.05em] transition-colors duration-500"
                          style={{ color: c.text }}
                          onMouseOver={e => e.currentTarget.style.color = c.accent}
                          onMouseOut={e => e.currentTarget.style.color = c.text}
                        >
                          {product.title}
                        </h3>
                        <p className="font-light text-sm leading-relaxed line-clamp-2" style={{ color: c.textSub }}>
                          {product.summary}
                        </p>
                      </div>
                    </Link>
                  </ScrollAnimation>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[800px] mx-auto px-8 text-center relative z-10">
            <ScrollAnimation>
              <p className="text-xs font-medium tracking-[0.4em] uppercase mb-6" style={{ color: c.accent }}>
                Consultation
              </p>
              <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-[0.05em]" style={{ color: c.text }}>
                需要专业建议？
              </h2>
              <p className="font-light max-w-lg mx-auto mb-10 tracking-[0.05em] leading-relaxed" style={{ color: c.textMuted }}>
                我们的音响专家团队将为您提供专业的系统咨询和选型建议
              </p>
              <Link
                to="/contact"
                className="inline-block px-10 py-3.5 text-xs font-medium tracking-[0.3em] uppercase transition-all duration-500"
                style={{ border: `1px solid ${c.borderAccent}`, color: c.accent }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = c.accent; e.currentTarget.style.color = c.ctaText; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = c.accent; }}
              >
                预约咨询
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
