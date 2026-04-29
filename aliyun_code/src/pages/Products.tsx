import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getProducts, getProductCategories, type Product, type ProductCategory } from '@/lib/queries';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      const [productsData, categoriesData] = await Promise.all([
      getProducts(50),
      getProductCategories()]
      );
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = selectedCategoryId ?
  products.filter((p) => String(p.category_id) === selectedCategoryId) :
  products;

  const selectedCategoryName = selectedCategoryId ?
  categories.find((c) => String(c.id) === selectedCategoryId)?.name :
  null;

  if (loading) {
    return (
      <>
        <PageMeta title="产品中心 - LIMIN AUDIO 立敏音响" />
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
        title="产品中心 - LIMIN AUDIO 立敏音响"
        description="探索 LIMIN AUDIO 代理的顶级 HIFI 音响产品，包括解码器、数字播放器、黑胶唱机、扬声器等"
        keywords={['HIFI 音响', '解码器', '数字播放器', '扬声器', '高端音响']} />

      <Header />
      <main className="pt-20">
        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">OUR PRODUCTS</p>
              <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6">
                产品中心
              </h1>
              <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
              <p className="font-light text-gray-400 max-w-2xl mx-auto tracking-[0.1em] text-base">
                精选全球顶级音响品牌，每一款产品都代表行业最高水准
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="max-w-[1920px] mx-auto px-8">
            {selectedCategoryName &&
            <div className="mb-12">
                <ScrollAnimation>
                  <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-2">CURRENT CATEGORY</p>
                  <h2 className="text-3xl font-extralight text-white tracking-[0.1em]">{selectedCategoryName}</h2>
                </ScrollAnimation>
              </div>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {filteredProducts.length === 0 ?
              <div className="col-span-full text-center py-20">
                  <p className="text-sm font-light text-gray-500 tracking-[0.2em]">该分类下暂无产品</p>
                </div> :

              filteredProducts.map((product, index) =>
              <ScrollAnimation key={product.id} delay={index * 50}>
                    <Link
                  to={`/product/${product.slug || product.id}`}
                  className="group block bg-black hover:bg-white/[0.02] transition-all duration-700">

                      <div className="aspect-[4/3] overflow-hidden bg-white/5">
                        <img
                      src={product.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/product-default.jpg?w=600&h=400&q=90'}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-extralight text-white mb-3 tracking-[0.1em]">
                          {product.title}
                        </h3>
                        <p className="font-light text-gray-500 text-base">
                          {product.summary}
                        </p>
                        <div className="mt-6 flex items-center text-xs font-light tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300">
                          <span>了解详情</span>
                          <svg
                        className="w-3 h-3 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">

                            <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5l7 7-7 7" />

                          </svg>
                        </div>
                      </div>
                    </Link>
                  </ScrollAnimation>
              )
              }
            </div>
          </div>
        </section>

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
                className="inline-block px-10 py-4 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-light tracking-[0.2em] uppercase transition-all duration-500">

                预约咨询
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
