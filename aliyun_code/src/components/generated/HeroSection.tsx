export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg')`
        }}>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <p className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-gray-400 mb-8 scroll-animate fade-in">
          EST. 2001
        </p>
        <h1 className="text-5xl md:text-8xl font-extralight text-white mb-8 leading-tight scroll-animate fade-in" style={{ animationDelay: '0.2s' }}>
          通往最好的<br />
          <span className="font-light">声音和音乐</span>
        </h1>
        <p className="text-sm md:text-base font-light tracking-[0.2em] text-gray-400 max-w-2xl mx-auto scroll-animate fade-in" style={{ animationDelay: '0.4s' }}>
          25 年专注高端音频，连接全球顶级音响品牌与中国发烧友
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0 scroll-animate fade-in" style={{ animationDelay: '0.6s' }} />
      </div>
    </section>
  );
}
