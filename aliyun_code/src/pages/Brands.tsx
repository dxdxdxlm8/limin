import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getBrands, getProductsByBrandName, type BrandInfo, type Product } from '@/lib/queries';

export default function Brands() {
  const [brands, setBrands] = useState<(BrandInfo & {products: Product[];})[]>([]);
  const [loading, setLoading] = useState(true);

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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-light text-gray-400 tracking-[0.2em]">加载中...</p>
          </div>
        </main>
        <Footer />
      </>);

  }

  return (
    <>
      <PageMeta
        title="品牌中心 - LIMIN AUDIO 立敏音响"
        description="了解 LIMIN AUDIO 代理的全球顶级音响品牌，包括 Ayon Audio、BAT、Benchmark、Ryan、Lyravox、MSB 等"
        keywords={['音响品牌', 'Ayon Audio', 'BAT', 'Benchmark', '高端音响', 'HIFI 品牌']} />

      <Header />
      <main className="pt-20">
        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">GLOBAL BRANDS</p>
              <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6">
                品牌中心
              </h1>
              <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
              <p className="font-light text-gray-400 max-w-2xl mx-auto tracking-[0.1em] text-base">
                精选全球顶级音响品牌，每一品牌都代表行业最高水准
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="space-y-24">
              {brands.map((brand, index) =>
              <ScrollAnimation key={brand.id} delay={index * 100}>
                  <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <Link to={`/brand/${brand.slug}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-xs font-light tracking-[0.2em] uppercase text-gray-500">
                            {brand.country}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6 hover:text-gray-300 transition-colors duration-300 tracking-[0.1em]">
                          {brand.name}
                        </h2>
                        <div
                          className="font-light text-gray-400 mb-8 tracking-[0.05em] text-base prose prose-invert max-w-none line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: brand.long_description || brand.description || '' }}
                        />
                      </Link>
                      <div>
                        <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-500 mb-6">
                          代表产品：
                        </h4>
                        {brand.products.length > 0 ?
                      <div className="grid grid-cols-2 gap-4">
                            {brand.products.map((product) =>
                        <Link
                          key={product.id}
                          to={`/product/${product.slug || product.id}`}
                          className="group">

                                <div className="aspect-[3/2] overflow-hidden bg-white/5">
                                  <img
                              src={product.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/product-default.jpg?w=400&h=300&q=90'}
                              alt={product.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                                </div>
                                <p className="font-light text-gray-400 mt-2 truncate tracking-[0.1em] text-base">{product.title}</p>
                              </Link>
                        )}
                          </div> :

                      <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-[3/2] overflow-hidden bg-white/5 flex items-center justify-center">
                              <p className="text-xs font-light text-gray-600 tracking-[0.1em]">暂无产品</p>
                            </div>
                          </div>
                      }
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <Link to={`/brand/${brand.slug}`} className="block aspect-[16/10] overflow-hidden bg-zinc-900">
                        {brand.image_url ? (
                          <img
                            src={brand.image_url}
                            alt={brand.name}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm font-light tracking-[0.2em] uppercase">{brand.name}</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  </div>
                </ScrollAnimation>
              )}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight text-[#1A1A1A] mb-6">
                对某个品牌感兴趣？
              </h2>
              <p className="text-sm font-light text-gray-600 max-w-2xl mx-auto mb-10 tracking-[0.05em]">
                我们的专家团队将为您提供详细的品牌介绍和产品推荐
              </p>
              <Link
                to="/contact"
                className="inline-block px-10 py-4 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-light tracking-[0.2em] uppercase transition-all duration-500">

                咨询该品牌
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
