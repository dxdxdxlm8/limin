import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getProductBySlug, getProductsByBrandName, type Product } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);
  const { isLight, colors: c } = useThemeContext();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const productData = await getProductBySlug(id);
      setProduct(productData || null);

      if (productData && productData.brand_name) {
        const related = await getProductsByBrandName(productData.brand_name, 4);
        setRelatedProducts(related.filter((p) => p.slug !== id));
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageMeta title="产品详情 - LIMIN AUDIO" />
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

  if (!product) {
    return (
      <>
        <PageMeta title="产品未找到 - LIMIN AUDIO" description="抱歉，您访问的产品不存在" />
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>产品未找到</h1>
              <p className="text-sm font-light mb-8" style={{ color: c.textMuted }}>抱歉，您访问的产品不存在或已下架</p>
              <Link to="/products" className="inline-block px-10 py-3 text-[10px] font-normal tracking-[0.3em] uppercase transition-all duration-700"
                style={{ border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, color: c.text }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${c.accent}4D`; e.currentTarget.style.color = c.accent; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = c.text; }}
              >
                返回产品中心
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
        title={`${product.title} - LIMIN AUDIO 立敏音响`}
        description={product.summary || ''}
        keywords={[product.title, product.brand_name || '', '高端音响', 'HIFI']}
      />
      <Header />
      <main className="pt-20">
        <section className="py-20" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <ScrollAnimation>
                <div className="space-y-4">
                  <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                    <img
                      src={product.featured_image_url || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {product.images.map((img, index) => (
                        <div key={index} className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                          <img
                            src={img}
                            alt={`${product.title} - 图片 ${index + 1}`}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <div className="lg:sticky lg:top-32">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[10px] font-normal tracking-[0.3em] uppercase" style={{ color: `${c.accent}99` }}>
                      {product.brand_name}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: c.border }} />
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extralight mb-10 tracking-[0.05em] leading-tight" style={{ color: c.text }}>
                    {product.title}
                  </h1>

                  <div
                    className={`text-sm font-light leading-[1.9] prose max-w-none ${isLight ? '' : 'prose-invert'}`}
                    style={{ color: c.textMuted }}
                    dangerouslySetInnerHTML={{ __html: product.content || product.summary || '' }}
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
            <div className="max-w-[1400px] mx-auto px-8">
              <ScrollAnimation>
                <div className="flex items-center gap-6 mb-12">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${c.border})` }} />
                  <p className="text-xs font-medium tracking-[0.4em] uppercase" style={{ color: c.accent }}>相关产品</p>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${c.border})` }} />
                </div>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <ScrollAnimation key={relatedProduct.id} delay={index * 100}>
                    <Link
                      to={`/product/${relatedProduct.slug || relatedProduct.id}`}
                      className="group block"
                      onMouseOver={() => setHoveredCardId(relatedProduct.id)}
                      onMouseOut={() => setHoveredCardId(null)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden mb-6" style={{ backgroundColor: c.bg }}>
                        <img
                          src={relatedProduct.featured_image_url || '/placeholder.svg'}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `linear-gradient(to top, ${c.bg}CC, transparent, transparent)` }} />
                      </div>
                      <h3 className="text-sm font-light tracking-[0.1em] mb-2 transition-colors duration-500"
                        style={{ color: hoveredCardId === relatedProduct.id ? c.accent : c.text }}>
                        {relatedProduct.title}
                      </h3>
                      <p className="text-xs font-light tracking-[0.05em] line-clamp-2" style={{ color: c.textSub }}>
                        {relatedProduct.summary}
                      </p>
                    </Link>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[800px] mx-auto px-8 text-center relative z-10">
            <ScrollAnimation>
              <p className="text-xs font-medium tracking-[0.4em] uppercase mb-6" style={{ color: c.accent }}>
                Contact
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
                联系我们
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
