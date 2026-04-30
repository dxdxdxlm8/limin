import { Link } from 'react-router-dom';
import { ScrollAnimation } from './ScrollAnimation';

const news = [
  {
    title: 'Ayon Audio 发布全新旗舰解码器',
    date: '2026-04-20',
    excerpt: '全新 Polaris V 解码器采用最新电子管技术，带来前所未有的音质体验...',
    image: '/placeholder.svg',
    category: '新品发布',
  },
  {
    title: '上海音响展圆满落幕',
    date: '2026-04-15',
    excerpt: '感谢所有莅临展台的朋友，共同见证高端音响的魅力...',
    image: '/placeholder.svg',
    category: '展会活动',
  },
  {
    title: 'Benchmark DAC3 荣获年度大奖',
    date: '2026-04-10',
    excerpt: '国际权威音响杂志评选 Benchmark DAC3 为年度最佳解码器...',
    image: '/placeholder.svg',
    category: '行业资讯',
  },
];

export function NewsSection() {
  return (
    <section className="py-32 bg-[#F5F3EF]">
      <div className="max-w-[1920px] mx-auto px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">LATEST NEWS</p>
            <h2 className="text-4xl md:text-5xl font-extralight text-[#1A1A1A]">新闻动态</h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <ScrollAnimation key={item.title} delay={index * 100}>
              <Link
                to={`/news`}
                className="group block bg-white overflow-hidden hover-lift"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-light tracking-[0.2em] uppercase text-gray-500">
                      {item.category}
                    </span>
                    <span className="text-xs font-light text-gray-400 tracking-[0.1em]">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-extralight text-[#1A1A1A] mb-3 tracking-[0.05em] line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-gray-600 leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="mt-6 flex items-center text-xs font-light tracking-[0.2em] uppercase text-gray-400 group-hover:text-[#1A1A1A] transition-colors duration-300">
                    <span>阅读更多</span>
                    <svg
                      className="w-3 h-3 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
