import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getBrandBySlug, getProductsByBrandName, type BrandInfo, type Product } from '@/lib/queries';

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-light text-gray-400 tracking-[0.2em]">加载中...</p>
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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight text-white mb-4 tracking-[0.15em]">品牌未找到</h1>
              <p className="text-sm font-light text-gray-400 mb-8">抱歉，您访问的品牌不存在或已下架</p>
              <Link to="/brands" className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs font-light tracking-[0.2em] uppercase transition-all duration-500">
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
        {/* Hero Section - 品牌大图 */}
        <section className="relative bg-black">
          <div className="max-w-[1400px] mx-auto px-8 pt-16 pb-8">
            <ScrollAnimation>
              <div className="text-center mb-12">
                <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-6">
                  {brand.country}
                </p>
                <h1 className="text-5xl md:text-7xl font-extralight text-white tracking-[0.15em]">
                  {brand.name}
                </h1>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* 品牌主图 - 全宽大图 */}
          <ScrollAnimation>
            <div className="max-w-[1200px] mx-auto px-8">
              <div className="relative aspect-[21/9] overflow-hidden">
                {brand.image_url ? (
                  <img 
                    src={brand.image_url} 
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-2xl font-extralight text-zinc-700 tracking-[0.2em]">{brand.name}</span>
                  </div>
                )}
                {/* 底部渐变遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* 品牌介绍 */}
        <section className="py-24 bg-black">
          <div className="max-w-[800px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center justify-center gap-8 mb-16">
                <div className="h-px w-24 bg-white/20" />
                <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500">品牌介绍</p>
                <div className="h-px w-24 bg-white/20" />
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={100}>
              <div
                className="prose prose-invert prose-lg max-w-none font-light leading-relaxed text-gray-300"
                dangerouslySetInnerHTML={{ __html: brand.long_description || '' }}
              />
            </ScrollAnimation>
          </div>
        </section>

        {/* 代表产品 */}
        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center justify-center gap-8 mb-16">
                <div className="h-px w-24 bg-white/20" />
                <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500">代表产品</p>
                <div className="h-px w-24 bg-white/20" />
              </div>
            </ScrollAnimation>

            {products.length === 0 ? (
              <ScrollAnimation>
                <div className="text-center py-12">
                  <p className="text-sm font-light text-gray-500 tracking-[0.2em]">该品牌暂无产品</p>
                </div>
              </ScrollAnimation>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <ScrollAnimation key={product.id} delay={index * 100}>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="group block"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-zinc-900 mb-6">
                        <img
                          src={product.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/product-default.jpg?w=600&h=400&q=90'}
                          alt={product.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <h3 className="text-sm font-light text-white tracking-[0.1em] mb-2 group-hover:text-gray-300 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs font-light text-gray-500 tracking-[0.1em] line-clamp-2">
                        {product.summary}
                      </p>
                    </Link>
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-black relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white" />
          </div>
          
          <div className="max-w-[800px] mx-auto px-8 text-center relative z-10">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-6">联系我们</p>
              <h2 className="text-3xl md:text-5xl font-extralight text-white mb-8 tracking-[0.1em]">
                对 {brand.name} 感兴趣？
              </h2>
              <p className="text-sm font-light text-gray-400 mb-12 tracking-[0.05em]">
                我们的专家团队将为您提供详细的品牌介绍和产品推荐
              </p>
              <Link
                to="/contact"
                className="inline-block px-12 py-4 border border-white/30 text-white text-xs font-light tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
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
