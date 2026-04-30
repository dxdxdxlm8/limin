import { useState, useEffect, useRef, useCallback } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { getHomeConfigFromAPI, getBrands, type ParsedHomeConfig, type BrandInfo, type HeroSlide } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

function useTheme() {
  const ctx = useThemeContext();
  return ctx.theme;
}

const darkC = {
  bg: '#050505',
  bgAlt: '#080808',
  bgCard: '#080808',
  bgCardHover: '#0c0a08',
  bgBrandCard: '#0F0F0F',
  text: 'white',
  textMuted: 'rgb(107 114 128)',
  textSub: 'rgb(75 85 99)',
  accent: '#C9A96E',
  accentHover: '#D4B87A',
  border: 'rgba(255,255,255,0.04)',
  borderHover: 'rgba(201,169,110,0.20)',
  borderAccent: 'rgba(201,169,110,0.30)',
  borderAccentLight: 'rgba(201,169,110,0.06)',
  gradientFrom: '#050505',
  gradientVia: '#0a0805',
  gradientTo: '#050505',
  heroBottomFade: '#050505',
  particleColor: 'rgba(201, 169, 110,',
  ctaText: 'black',
  dotPattern: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjAxLDE2OSwxMTAsMC4wNSkiLz48L3N2Zz4=',
};

const lightC = {
  bg: '#F5F0E8',
  bgAlt: '#EBE4D9',
  bgCard: '#FDFAF5',
  bgCardHover: '#F8F3EB',
  bgBrandCard: '#FDFAF5',
  text: '#1A1408',
  textMuted: '#4A4030',
  textSub: '#6B5F4F',
  accent: '#6B4F3A',
  accentHover: '#5A4230',
  border: 'rgba(107,79,58,0.12)',
  borderHover: 'rgba(107,79,58,0.28)',
  borderAccent: 'rgba(107,79,58,0.35)',
  borderAccentLight: 'rgba(107,79,58,0.08)',
  gradientFrom: '#F5F0E8',
  gradientVia: '#EDE6DA',
  gradientTo: '#F5F0E8',
  heroBottomFade: '#F5F0E8',
  particleColor: 'rgba(139, 115, 85,',
  ctaText: 'white',
  dotPattern: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTM5LDExNSw4NSwwLjA1KSIvPjwvc3ZnPg==',
};

function useColors() {
  const theme = useTheme();
  return theme === 'light' ? lightC : darkC;
}

function ParticleBackground() {
  const c = useColors();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${c.particleColor} ${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${c.particleColor} ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [c]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const c = useColors();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const displaySlides = slides.length > 0 ? slides : [{
    image: '/images/hero-default.jpg',
    title: '通往最好的声音和音乐',
    subtitle: '25 年专注高端音频，连接全球顶级音响品牌与中国发烧友'
  }];

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [isTransitioning, currentIndex]);

  const goToPrev = () => goToSlide((currentIndex - 1 + displaySlides.length) % displaySlides.length);
  const goToNext = () => goToSlide((currentIndex + 1) % displaySlides.length);

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length, goToNext]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    });
  };

  const currentSlide = displaySlides[currentIndex];

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: c.bg }}
      onMouseMove={handleMouseMove}
    >
      <ParticleBackground />

      {displaySlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-all duration-[1200ms] ease-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            transform: index === currentIndex
              ? `scale(1.05) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
              : 'scale(1.1)',
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-[2]">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/60 via-black/30 to-black/80' : 'bg-gradient-to-b from-black/20 via-transparent to-black/40'}`} />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-black/40 via-transparent to-black/40' : 'bg-gradient-to-r from-transparent via-transparent to-transparent'}`} />
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: `linear-gradient(to top, ${c.heroBottomFade}, transparent)` }} />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div
          className="mb-8 transition-all duration-1000"
          style={{
            transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
          }}
        >
          <p className="text-xs md:text-sm font-light tracking-[0.5em] uppercase mb-2" style={{ color: `${c.accent}CC` }}>
            LIMIN AUDIO
          </p>
          <div className="w-12 h-px mx-auto" style={{ backgroundColor: `${c.accent}80` }} />
        </div>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extralight mb-6 tracking-[0.08em] leading-tight transition-all duration-1000"
          style={{
            color: theme === 'dark' ? c.text : '#FDFAF5',
            transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
            textShadow: theme === 'dark' ? '0 0 80px rgba(201, 169, 110, 0.15)' : '0 2px 30px rgba(0,0,0,0.5)',
          }}
        >
          <span className="hero-title-line block overflow-hidden">
            <span className="inline-block animate-slide-up">{currentSlide.title}</span>
          </span>
        </h1>

        <div className="w-16 h-px mb-6" style={{ background: `linear-gradient(to right, transparent, ${c.accent}99, transparent)` }} />

        <p
          className="text-sm md:text-base font-light max-w-lg tracking-[0.15em] leading-relaxed transition-all duration-1000"
          style={{
            color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(253,250,245,0.85)',
            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`,
            textShadow: theme === 'dark' ? 'none' : '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          {currentSlide.subtitle}
        </p>

        <div className="mt-12 flex gap-6">
          <a
            href="/products"
            className="group relative px-8 py-3 text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500"
            style={{ border: `1px solid ${c.accent}66`, color: c.accent }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.ctaText; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}66`; e.currentTarget.style.color = c.accent; }}
          >
            <span className="relative z-10">探索产品</span>
            <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" style={{ backgroundColor: c.accent }} />
          </a>
          <a
            href="/brands"
            className="px-8 py-3 text-sm tracking-[0.2em] uppercase transition-all duration-500"
            style={{
              color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(26,26,26,0.6)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; e.currentTarget.style.color = c.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(26,26,26,0.6)'; }}
          >
            品牌故事
          </a>
        </div>
      </div>

      {displaySlides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}80`; e.currentTarget.style.backgroundColor = `${c.accent}1A`; e.currentTarget.querySelector('svg')?.setAttribute('style', `color: ${c.accent}`); }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.querySelector('svg')?.setAttribute('style', `color: ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}`); }}
            >
              <svg className="w-5 h-5 transition-colors" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}80`; e.currentTarget.style.backgroundColor = `${c.accent}1A`; e.currentTarget.querySelector('svg')?.setAttribute('style', `color: ${c.accent}`); }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.querySelector('svg')?.setAttribute('style', `color: ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}`); }}
            >
              <svg className="w-5 h-5 transition-colors" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <div className="absolute right-20 md:right-28 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group flex items-center justify-end gap-3 cursor-pointer"
              >
                <span className="text-xs tracking-[0.1em] transition-all duration-500"
                  style={{
                    color: index === currentIndex ? c.accent : (theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
                    opacity: index === currentIndex ? 1 : 0,
                  }}
                  onMouseEnter={e => { if (index !== currentIndex) e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { if (index !== currentIndex) e.currentTarget.style.opacity = '0'; }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-8 h-px transition-all duration-500"
                  style={{
                    backgroundColor: index === currentIndex ? c.accent : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                    width: index === currentIndex ? '3rem' : '2rem',
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>Scroll</span>
        <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}, transparent)` }} />
      </div>
    </section>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function BrandCard({ brand, index }: { brand: BrandInfo; index: number }) {
  const c = useColors();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <ScrollAnimation delay={index * 80}>
      <a
        ref={cardRef}
        href={`/brand/${brand.slug}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center p-4 aspect-[4/3] overflow-hidden transition-all duration-700"
        style={{
          backgroundColor: c.bgBrandCard,
          border: `1px solid ${c.border}`,
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = c.borderAccent; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = c.border; }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${c.accent}14 0%, transparent 60%)`
              : 'none',
          }}
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
        </div>

        {brand.logo_url ? (
          <img
            src={brand.logo_url}
            alt={brand.name}
            className="relative z-10 w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <p className="relative z-10 font-light transition-colors duration-700 tracking-[0.15em] text-base text-center"
            style={{ color: c.textSub }}
            onMouseOver={e => { e.currentTarget.style.color = c.accent; }}
            onMouseOut={e => { e.currentTarget.style.color = c.textSub; }}
          >
            {brand.name}
          </p>
        )}
      </a>
    </ScrollAnimation>
  );
}

export default function Home() {
  const [homeConfig, setHomeConfig] = useState<ParsedHomeConfig | null>(null);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const c = useColors();

  useEffect(() => {
    async function fetchData() {
      const [config, brandsData] = await Promise.all([
        getHomeConfigFromAPI(),
        getBrands(),
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
        <main className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{ border: `1px solid ${c.accent}4D`, borderTopColor: c.accent }} />
            <p className="text-sm font-light tracking-[0.2em]" style={{ color: c.textMuted }}>加载中...</p>
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

        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent}33, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent}33, transparent)` }} />

          <div className="relative max-w-[1400px] mx-auto px-8">
            <ScrollAnimation>
              <div className="text-center mb-12">
                <p className="text-xs font-light tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                  Our Philosophy
                </p>
                <h2 className="text-4xl md:text-5xl font-extralight leading-tight mb-6" style={{ color: c.text }}>
                  {homeConfig?.philosophyTitle || '对音质追求的执着'}
                </h2>
                <div className="w-16 h-px mx-auto" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: homeConfig?.yearsExperience || 25, suffix: '+', label: '年行业经验', desc: '深耕高端音频领域' },
                { value: homeConfig?.globalBrands || 50, suffix: '+', label: '全球合作品牌', desc: '甄选世界顶级音响' },
                { value: homeConfig?.servedCustomers || 10000, suffix: '+', label: '服务客户', desc: '信赖之选' },
              ].map((item, index) => (
                <ScrollAnimation key={index} delay={index * 150}>
                  <div className="relative p-12 text-center group transition-all duration-700"
                    style={{
                      backgroundColor: c.bgCard,
                      border: `1px solid ${c.border}`,
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = c.borderHover; e.currentTarget.style.backgroundColor = c.bgCardHover; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.backgroundColor = c.bgCard; }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to right, transparent, ${c.accent}4D, transparent)` }} />
                    <p className="text-5xl md:text-6xl font-extralight mb-4 tabular-nums" style={{ color: c.text }}>
                      <AnimatedCounter target={item.value} suffix={item.suffix} />
                    </p>
                    <div className="w-8 h-px mx-auto mb-4 group-hover:w-16 transition-all duration-500" style={{ backgroundColor: `${c.accent}4D` }} />
                    <p className="font-normal tracking-[0.2em] uppercase text-sm mb-2" style={{ color: `${c.accent}CC` }}>
                      {item.label}
                    </p>
                    <p className="text-xs tracking-[0.1em]" style={{ color: c.textMuted }}>
                      {item.desc}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-light tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                    Selected Brands
                  </p>
                  <h2 className="text-4xl md:text-5xl font-extralight" style={{ color: c.text }}>
                    精选品牌
                  </h2>
                </div>
                <a
                  href="/brands"
                  className="group flex items-center gap-3 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500 hidden md:flex"
                  style={{ color: c.textMuted }}
                  onMouseOver={e => e.currentTarget.style.color = c.accent}
                  onMouseOut={e => e.currentTarget.style.color = c.textMuted}
                >
                  <span>查看全部</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-4 gap-px max-h-[360px] overflow-hidden" style={{ backgroundColor: c.border }}>
              {brands.slice(0, 8).map((brand, index) => (
                <BrandCard key={brand.id} brand={brand} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${c.bgAlt}, ${c.bg}, ${c.bgAlt})` }} />
          </div>

          <div className="relative max-w-[1400px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.4em] uppercase mb-6" style={{ color: `${c.accent}99` }}>
                Experience Excellence
              </p>
              <h2 className="text-4xl md:text-6xl font-extralight mb-8 leading-tight" style={{ color: c.text }}>
                开启您的听觉之旅
              </h2>
              <p className="text-base font-light max-w-md mx-auto mb-12 tracking-[0.1em] leading-relaxed" style={{ color: c.textMuted }}>
                预约线下体验，感受顶级音响带来的震撼
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-normal transition-colors duration-500"
                style={{ backgroundColor: c.accent, color: c.ctaText }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = c.accentHover}
                onMouseOut={e => e.currentTarget.style.backgroundColor = c.accent}
              >
                预约体验
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
