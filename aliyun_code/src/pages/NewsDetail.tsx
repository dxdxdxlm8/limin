import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getPostBySlug, type Post } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLight, colors: c } = useThemeContext();

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await getPostBySlug(id);
      setArticle(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageMeta title="新闻详情 - LIMIN AUDIO 立敏音响" />
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

  if (!article) {
    return (
      <>
        <PageMeta title="新闻未找到 - LIMIN AUDIO 立敏音响" description="抱歉，您访问的新闻不存在" />
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>新闻未找到</h1>
              <p className="text-sm font-light mb-8" style={{ color: c.textMuted }}>抱歉，您访问的新闻不存在或已下架</p>
              <Link to="/news" className="inline-block px-10 py-3 text-[10px] font-normal tracking-[0.3em] uppercase transition-all duration-700"
                style={{ border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, color: c.text }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${c.accent}4D`; e.currentTarget.style.color = c.accent; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = c.text; }}
              >
                返回新闻中心
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
        title={`${article.title} - LIMIN AUDIO 立敏音响`}
        description={article.summary || ''}
        keywords={[article.title, 'LIMIN AUDIO', '音响资讯']}
      />
      <Header />
      <main className="pt-20">
        <article className="py-16" style={{ backgroundColor: c.bg }}>
          <div className="max-w-4xl mx-auto px-8">
            <ScrollAnimation>
              <div className="text-center mb-10">
                {article.published_at && (
                  <p className="text-[10px] font-normal tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                    {new Date(article.published_at).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extralight mb-6 leading-tight tracking-[0.05em]" style={{ color: c.text }}>
                  {article.title}
                </h1>
                <div className="w-16 h-px mx-auto" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              </div>
            </ScrollAnimation>

            {article.featured_image_url && (
              <ScrollAnimation delay={200}>
                <div className="aspect-[21/9] overflow-hidden mb-10" style={{ backgroundColor: c.bgAlt }}>
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollAnimation>
            )}

            <ScrollAnimation delay={300}>
              <div
                className={`prose prose-lg max-w-none text-sm font-light leading-[1.9] tracking-[0.02em] ${isLight ? '' : 'prose-invert'}`}
                style={{ color: c.textSub }}
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <div className="mt-16 pt-8" style={{ borderTop: `1px solid ${c.border}` }}>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-3 text-[10px] font-normal tracking-[0.3em] uppercase transition-colors duration-500"
                  style={{ color: c.textSub }}
                  onMouseOver={e => e.currentTarget.style.color = c.accent}
                  onMouseOut={e => e.currentTarget.style.color = c.textSub}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回新闻中心
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
