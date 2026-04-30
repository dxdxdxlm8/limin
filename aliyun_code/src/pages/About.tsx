import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { useThemeContext } from '@/lib/themeContext';

export default function About() {
  const { colors: c } = useThemeContext();

  return (
    <>
      <PageMeta
        title="关于我们 - LIMIN AUDIO 立敏音响"
        description="了解 LIMIN AUDIO 立敏音响的品牌故事、企业理念和专业能力，25 年高端音频行业经验"
        keywords={['LIMIN AUDIO', '立敏音响', '品牌故事', '企业理念', '音响专家']} />

      <Header />
      <main className="pt-20">
        <section className="py-24" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase mb-4" style={{ color: c.textMuted }}>ABOUT US</p>
              <h1 className="text-4xl md:text-6xl font-extralight mb-6" style={{ color: c.text }}>
                关于我们
              </h1>
              <p className="text-sm font-light max-w-2xl mx-auto tracking-[0.1em]" style={{ color: c.textSub }}>
                25 年专注高端音频，连接全球顶级音响品牌与中国发烧友
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollAnimation>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extralight mb-8 tracking-[0.1em]" style={{ color: c.text }}>
                    品牌故事
                  </h2>
                  <div className="space-y-6 text-sm font-light leading-relaxed tracking-[0.05em]" style={{ color: c.textSub }}>
                    <p className="text-base">
                      LIMIN AUDIO 立敏音响成立于 2001 年，是中国领先的高端 HIFI 音响品牌运营商。25 年来，我们始终专注于一个目标：为中国发烧友带来世界顶级的音频体验。
                    </p>
                    <p className="text-base">
                      创始人是一位资深音响爱好者，在欧美游学期间深刻体会到高端音响带来的音乐震撼。回国后，他决心将全球最好的音响品牌引入中国，让更多音乐爱好者能够体验到真正的 Hi-End 音质。
                    </p>
                    <p className="text-base">
                      经过 25 年的深耕，LIMIN AUDIO 已成功代理了 Ayon Audio、BAT、Benchmark、Ryan、Lyravox、MSB 等多个国际顶级品牌，建立了完善的销售和服务网络，成为中国高端音响市场的领导者。
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <img
                  src="/placeholder.svg"
                  alt="品牌故事"
                  className="w-full" />
              </ScrollAnimation>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight text-center mb-16 tracking-[0.1em]" style={{ color: c.text }}>
                企业理念
              </h2>
            </ScrollAnimation>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation delay={100}>
                <div className="text-center p-10 transition-all duration-700" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ border: `1px solid ${c.borderAccent}` }}>
                    <svg className="w-6 h-6" fill="none" stroke={c.accent} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>
                    对音质的执着
                  </h3>
                  <p className="text-xs font-light leading-relaxed tracking-[0.05em]" style={{ color: c.textSub }}>
                    我们坚信，最好的音乐值得最好的重放。每一款产品的选择，都经过严格的试听和评估，确保达到我们对音质的严苛标准。
                  </p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <div className="text-center p-10 transition-all duration-700" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ border: `1px solid ${c.borderAccent}` }}>
                    <svg className="w-6 h-6" fill="none" stroke={c.accent} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>
                    专业的服务
                  </h3>
                  <p className="text-xs font-light leading-relaxed tracking-[0.05em]" style={{ color: c.textSub }}>
                    我们不仅提供顶级产品，更提供专业的系统咨询、选型建议和定制服务。我们的团队由资深音响专家组成，随时为您提供专业支持。
                  </p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={300}>
                <div className="text-center p-10 transition-all duration-700" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ border: `1px solid ${c.borderAccent}` }}>
                    <svg className="w-6 h-6" fill="none" stroke={c.accent} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-extralight mb-4 tracking-[0.15em]" style={{ color: c.text }}>
                    全球的视野
                  </h3>
                  <p className="text-xs font-light leading-relaxed tracking-[0.05em]" style={{ color: c.textSub }}>
                    我们持续在全球范围内寻找最优秀的音响品牌和产品，将世界各地的音频精华汇聚中国，为发烧友提供多元化的顶级选择。
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight text-center mb-16 tracking-[0.1em]" style={{ color: c.text }}>
                专业能力
              </h2>
            </ScrollAnimation>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollAnimation delay={100}>
                <div className="p-10" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                  <h3 className="text-xl font-extralight mb-6 tracking-[0.15em]" style={{ color: c.text }}>
                    严格选品标准
                  </h3>
                  <p className="text-sm font-light leading-relaxed mb-6" style={{ color: c.textSub }}>
                    每一款产品的引入都经过严格的评估流程：
                  </p>
                  <ul className="space-y-3 text-sm font-light" style={{ color: c.textSub }}>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>音质表现必须达到行业顶尖水准</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>工艺品质必须经得起时间考验</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>品牌必须有清晰的发展理念和技术实力</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>必须能够提供完善的售后服务支持</span>
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <div className="p-10" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                  <h3 className="text-xl font-extralight mb-6 tracking-[0.15em]" style={{ color: c.text }}>
                    技术服务能力
                  </h3>
                  <p className="text-sm font-light leading-relaxed mb-6" style={{ color: c.textSub }}>
                    我们提供全方位的技术支持服务：
                  </p>
                  <ul className="space-y-3 text-sm font-light" style={{ color: c.textSub }}>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>专业音响系统咨询与规划</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>个性化定制服务</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>设备安装调试与优化</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: c.textMuted }}>•</span>
                      <span>售后维护与技术支持</span>
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        <section className="py-24" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight mb-4 tracking-[0.1em]" style={{ color: c.text }}>
                荣誉资质
              </h2>
              <p className="text-sm font-light mb-12 max-w-2xl mx-auto" style={{ color: c.textSub }}>
                25 年深耕，获得行业广泛认可
              </p>
            </ScrollAnimation>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: c.border }}>
              {[
                { value: '25+', label: '年行业经验' },
                { value: '50+', label: '全球合作品牌' },
                { value: '10000+', label: '服务客户' },
                { value: '500+', label: '成功案例' },
              ].map((item, index) => (
                <ScrollAnimation key={index} delay={(index + 1) * 100}>
                  <div className="p-10" style={{ backgroundColor: c.bgCard }}>
                    <div className="text-4xl md:text-5xl font-extralight mb-3" style={{ color: c.text }}>{item.value}</div>
                    <div className="font-light tracking-[0.15em] text-sm" style={{ color: c.textSub }}>{item.label}</div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-extralight mb-6" style={{ color: c.text }}>
                想了解更多？
              </h2>
              <p className="text-sm font-light max-w-2xl mx-auto mb-10" style={{ color: c.textSub }}>
                欢迎联系我们，了解 LIMIN AUDIO 的专业服务和产品
              </p>
              <a
                href="/contact"
                className="inline-block px-10 py-4 text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
                style={{ backgroundColor: c.accent, color: c.ctaText }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = c.accentHover}
                onMouseOut={e => e.currentTarget.style.backgroundColor = c.accent}
              >
                联系我们
              </a>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
