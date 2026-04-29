import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getPosts, type Post } from '@/lib/queries';

export default function News() {
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getPosts(20);
      setNews(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PageMeta title="新闻中心 - LIMIN AUDIO 立敏音响" />
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
        title="新闻中心 - LIMIN AUDIO 立敏音响"
        description="了解 LIMIN AUDIO 最新动态，包括品牌新闻、产品发布、展会活动和行业资讯"
        keywords={['LIMIN AUDIO 新闻', '音响资讯', '新品发布', '展会活动']} />

      <Header />
      <main className="pt-20">
        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">LATEST NEWS</p>
              <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6">
                新闻中心
              </h1>
              <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
              <p className="font-light text-gray-400 max-w-2xl mx-auto tracking-[0.1em] text-base">
                了解 LIMIN AUDIO 最新动态、产品发布和行业资讯
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="space-y-px bg-white/5">
              {news.length === 0 ?
              <div className="text-center py-20">
                  <p className="text-sm font-light text-gray-500 tracking-[0.2em]">暂无新闻</p>
                </div> :

              news.map((item, index) =>
              <ScrollAnimation key={item.id} delay={index * 50}>
                    <article className="group bg-black hover:bg-white/[0.02] transition-all duration-700">
                      <Link to={`/news/${item.slug || item.id}`} className="block">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                          <div className="md:col-span-5 aspect-[16/10] md:aspect-auto overflow-hidden">
                            <img
                          src={item.featured_image_url || 'https://baas-api.wanwang.xin/toc/image/preview/news-default.jpg?w=800&h=500&q=90'}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                          </div>
                          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                            {item.published_at &&
                        <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-light text-gray-600 tracking-[0.1em]">
                                  {new Date(item.published_at).toLocaleDateString('zh-CN')}
                                </span>
                              </div>
                        }
                            <h2 className="text-2xl md:text-3xl font-extralight text-white mb-4 tracking-[0.05em] group-hover:text-gray-300 transition-colors duration-300">
                              {item.title}
                            </h2>
                            <p className="text-sm font-light text-gray-400 leading-relaxed mb-6">
                              {item.summary}
                            </p>
                            <div className="flex items-center text-xs font-light tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300">
                              <span>阅读更多</span>
                              <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </ScrollAnimation>
              )
              }
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
