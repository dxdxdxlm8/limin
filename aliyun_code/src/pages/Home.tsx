import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getHomeConfigFromAPI, getBrands, type ParsedHomeConfig, type BrandInfo, type HeroSlide } from '@/lib/queries';

// 轮播图组件
function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // 如果没有轮播图数据，使用默认数据
  const displaySlides = slides.length > 0 ? slides : [{
    image: '/images/hero-default.jpg',
    title: '通往最好的声音和音乐',
    subtitle: '25 年专注高端音频，连接全球顶级音响品牌与中国发烧友'
  }];

  const currentSlide = displaySlides[currentIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentSlide.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-white/60 mb-6">
          LIMIN AUDIO
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-8 tracking-[0.05em] leading-tight">
          {currentSlide.title}
        </h1>
        <div className="w-16 h-px bg-white/30 mb-8" />
        <p className="text-base md:text-lg text-white/70 font-light max-w-xl tracking-[0.1em]">
          {currentSlide.subtitle}
        </p>
      </div>

      {/* Navigation Arrows */}
      {displaySlides.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function Home() {
  const [homeConfig, setHomeConfig] = useState<ParsedHomeConfig | null>(null);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [config, brandsData] = await Promise.all([
        getHomeConfigFromAPI(),
        getBrands()
      ]);
      setHomeConfig(config);
      setBrands(brandsData.slice(0, 6));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PageMeta
          title="LIMIN AUDIO 立敏音响 - 通往最好的声音和音乐"
          description="25 年专注高端音频，连接全球顶级音响品牌与中国发烧友" />

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
        title="LIMIN AUDIO 立敏音响 - 通往最好的声音和音乐"
        description={homeConfig?.philosophyTitle || "25 年专注高端音频，连接全球顶级音响品牌与中国发烧友，提供 Ayon Audio、BAT、Benchmark 等顶级 Hi-End 音响设备"}
        keywords={['LIMIN AUDIO', '立敏音响', '高端音响', 'HIFI', 'Hi-End', '音响品牌']} />

      <Header />
      <main>
        <HeroCarousel slides={homeConfig?.heroSlides || []} />

        <section className="py-32 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <div className="text-center mb-20">
                <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">OUR PHILOSOPHY</p>
                <h2 className="text-4xl md:text-5xl font-extralight text-white leading-tight mb-6">
                  {homeConfig?.philosophyTitle || '对音质追求的执着'}
                </h2>
                <div className="w-12 h-px bg-white/20 mx-auto" />
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-900/30 border border-white/5 p-12 hover:border-white/10 transition-all duration-700 group">
                <ScrollAnimation delay={100}>
                  <p className="text-5xl font-extralight text-white mb-4">{homeConfig?.yearsExperience || 25}+</p>
                  <div className="w-8 h-px bg-white/20 mb-4 group-hover:w-12 transition-all duration-500" />
                  <p className="font-light tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400 transition-colors duration-500 text-sm">
                    年行业经验
                  </p>
                </ScrollAnimation>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-12 hover:border-white/10 transition-all duration-700 group">
                <ScrollAnimation delay={200}>
                  <p className="text-5xl font-extralight text-white mb-4">{homeConfig?.globalBrands || 50}+</p>
                  <div className="w-8 h-px bg-white/20 mb-4 group-hover:w-12 transition-all duration-500" />
                  <p className="font-light tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400 transition-colors duration-500 text-sm">
                    全球合作品牌
                  </p>
                </ScrollAnimation>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-12 hover:border-white/10 transition-all duration-700 group">
                <ScrollAnimation delay={300}>
                  <p className="text-5xl font-extralight text-white mb-4">{homeConfig?.servedCustomers || 10000}+</p>
                  <div className="w-8 h-px bg-white/20 mb-4 group-hover:w-12 transition-all duration-500" />
                  <p className="font-light tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400 transition-colors duration-500 text-sm">
                    服务客户
                  </p>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#EDE8E0]">
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">SELECTED BRANDS</p>
                  <h2 className="text-4xl md:text-5xl font-extralight text-[#2C2C2C]">精选品牌</h2>
                </div>
                <a href="/brands" className="text-xs font-light tracking-[0.2em] uppercase text-gray-500 hover:text-[#2C2C2C] transition-colors duration-300 hidden md:block">
                  查看全部 →
                </a>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand, index) =>
              <ScrollAnimation key={brand.id} delay={index * 50}>
                  <a href={`/brand/${brand.slug}`} className="flex items-center justify-center bg-[#F7F4F0] p-6 hover:bg-[#FFFFFF] transition-all duration-700 group aspect-[3/2] overflow-hidden shadow-sm">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <p className="font-light text-gray-500 group-hover:text-[#2C2C2C] transition-colors duration-500 tracking-[0.15em] text-base text-center">
                        {brand.name}
                      </p>
                    )}
                  </a>
                </ScrollAnimation>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
