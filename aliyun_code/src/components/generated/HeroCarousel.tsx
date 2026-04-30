import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    image: '/placeholder.svg',
    title: '通往最好的声音和音乐',
    subtitle: '25 年专注高端音频，连接全球顶级音响品牌与中国发烧友',
  },
  {
    image: '/placeholder.svg',
    title: '全球顶级音响品牌',
    subtitle: '代理 Ayon Audio、BAT、Benchmark、Ryan、Lyravox、MSB 等国际知名品牌',
  },
  {
    image: '/placeholder.svg',
    title: '专业音响咨询服务',
    subtitle: '资深音响专家团队，为您提供系统咨询和选型建议',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-screen min-h-[800px] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${slide.image}')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-6 max-w-5xl mx-auto">
              <p className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-gray-400 mb-8">
                EST. 2001
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white mb-8 leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base font-light tracking-[0.2em] text-gray-400 max-w-3xl mx-auto">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/50 hover:text-white transition-colors duration-300 hidden md:block"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/50 hover:text-white transition-colors duration-300 hidden md:block"
        aria-label="Next slide"
      >
        <FaChevronRight size={24} />
      </button>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 ${
              index === currentSlide
                ? 'w-8 h-1 bg-white'
                : 'w-1 h-1 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
