import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { useParams, Link } from 'react-router-dom';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getPostBySlug, type Post } from '@/lib/queries';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-light text-gray-400 tracking-[0.2em]">加载中...</p>
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
        <main className="pt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <ScrollAnimation>
              <h1 className="text-3xl font-extralight text-white mb-4 tracking-[0.15em]">新闻未找到</h1>
              <p className="text-sm font-light text-gray-400 mb-8">抱歉，您访问的新闻不存在或已下架</p>
              <Link to="/news" className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs font-light tracking-[0.2em] uppercase transition-all duration-500">
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
        <article className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center gap-6 mb-8">
                {article.published_at && (
                  <span className="text-xs font-light text-gray-600 tracking-[0.1em]">
                    {new Date(article.published_at).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extralight text-white mb-10 leading-tight tracking-[0.05em]">
                {article.title}
              </h1>
            </ScrollAnimation>

            {article.featured_image_url && (
              <ScrollAnimation delay={200}>
                <div className="aspect-[21/9] overflow-hidden mb-12 bg-white/5">
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
                className="prose prose-invert prose-lg max-w-none text-sm font-light text-gray-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <div className="border-t border-white/5 mt-12 pt-8">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-3 text-xs font-light tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors duration-300"
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
