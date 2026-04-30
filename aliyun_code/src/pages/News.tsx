import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getPosts, type Post } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function News() {
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const { colors: c } = useThemeContext();

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
        title="新闻中心 - LIMIN AUDIO 立敏音响"
        description="了解 LIMIN AUDIO 最新动态，包括品牌新闻、产品发布、展会活动和行业资讯"
        keywords={['LIMIN AUDIO 新闻', '音响资讯', '新品发布', '展会活动']}
      />

      <Header />
      <main className="pt-20">
        <section className="relative py-12 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-[10px] font-normal tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                Latest News
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.1em] mb-4" style={{ color: c.text }}>
                新闻中心
              </h1>
              <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              <p className="font-light max-w-xl mx-auto tracking-[0.05em] text-base leading-relaxed" style={{ color: c.textMuted }}>
                了解 LIMIN AUDIO 最新动态、产品发布和行业资讯
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1400px] mx-auto px-8">
            {news.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm font-light tracking-[0.2em]" style={{ color: c.textSub }}>暂无新闻</p>
              </div>
            ) : (
              <div className="space-y-12">
                {news.map((item, index) => (
                  <ScrollAnimation key={item.id} delay={index * 80}>
                    <article
                      className="group"
                      onMouseOver={() => setHoveredId(item.id)}
                      onMouseOut={() => setHoveredId(null)}
                    >
                      <Link to={`/news/${item.slug || item.id}`} className="block">
                        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                          <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                              <img
                                src={item.featured_image_url || '/placeholder.svg'}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                              />
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                style={{ background: `linear-gradient(to top, ${c.bg}99, transparent, transparent)` }}
                              />
                            </div>
                          </div>

                          <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <div className="lg:px-8">
                              {item.published_at && (
                                <div className="flex items-center gap-4 mb-6">
                                  <span className="text-[10px] font-normal tracking-[0.3em] uppercase" style={{ color: `${c.accent}99` }}>
                                    {new Date(item.published_at).toLocaleDateString('zh-CN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <div className="flex-1 h-px" style={{ backgroundColor: c.border }} />
                                </div>
                              )}
                              <h2
                                className="text-2xl md:text-3xl font-extralight mb-6 tracking-[0.05em] leading-tight transition-colors duration-500"
                                style={{ color: hoveredId === item.id ? c.accent : c.text }}
                              >
                                {item.title}
                              </h2>
                              <p className="text-sm font-light leading-[1.8] mb-8 line-clamp-3" style={{ color: c.textMuted }}>
                                {item.summary}
                              </p>
                              <div
                                className="flex items-center text-[10px] font-normal tracking-[0.3em] uppercase transition-colors duration-500"
                                style={{ color: hoveredId === item.id ? c.accent : c.textSub }}
                              >
                                <span>阅读全文</span>
                                <svg className="w-3 h-3 ml-3 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
