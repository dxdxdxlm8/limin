import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getProductBySlug, getProductsByBrandName, type Product } from '@/lib/queries';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-light text-gray-400 tracking-[0.2em]">加载中...</p>
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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight text-white mb-4 tracking-[0.15em]">产品未找到</h1>
              <p className="text-sm font-light text-gray-400 mb-8">抱歉，您访问的产品不存在或已下架</p>
              <Link to="/products" className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs font-light tracking-[0.2em] uppercase transition-all duration-500">
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
        <section className="py-20 bg-black">
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ScrollAnimation>
                <div className="space-y-4">
                  {/* 封面图 */}
                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    <img
                      src={product.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/product-default.jpg?w=800&h=600&q=90'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 其他产品图片 */}
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {product.images.map((img, index) => (
                        <div
                          key={index}
                          className="aspect-[4/3] overflow-hidden bg-white/5"
                        >
                          <img
                            src={img}
                            alt={`${product.title} - 图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-light tracking-[0.2em] uppercase text-gray-500">
                      {product.brand_name}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extralight text-white mb-8 tracking-[0.1em]">
                    {product.title}
                  </h1>
                  <div
                    className="text-sm font-light text-gray-400 leading-relaxed mb-10 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.content || product.summary || '' }}
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-20 bg-black">
            <div className="max-w-[1920px] mx-auto px-8">
              <ScrollAnimation>
                <h2 className="text-2xl font-extralight text-white mb-10 tracking-[0.15em]">
                  同品牌产品
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/product/${relatedProduct.slug || relatedProduct.id}`}
                      className="group block bg-black hover:bg-white/[0.02] transition-all duration-700"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-white/5">
                        <img
                          src={relatedProduct.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/product-default.jpg?w=600&h=400&q=90'}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-sm font-light text-white mb-2 tracking-[0.1em]">
                          {relatedProduct.title}
                        </h3>
                        <p className="text-xs font-light text-gray-500 tracking-[0.1em]">
                          {relatedProduct.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}

        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight text-[#1A1A1A] mb-6">
                需要专业建议？
              </h2>
              <p className="text-sm font-light text-gray-600 max-w-2xl mx-auto mb-10 tracking-[0.05em]">
                我们的音响专家团队将为您提供专业的系统咨询和选型建议
              </p>
              <Link
                to="/contact"
                className="inline-block px-10 py-4 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
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
