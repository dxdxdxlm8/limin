import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { getContactInfo, type ContactInfo } from '@/lib/queries';
import { useThemeContext } from '@/lib/themeContext';

function ContactCard({ icon: Icon, label, children, c }: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  children: React.ReactNode;
  c: any;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="text-center p-12 transition-all duration-700"
      style={{
        backgroundColor: c.bgCard,
        border: `1px solid ${hovered ? c.borderHover : c.border}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center transition-colors duration-700"
        style={{ border: `1px solid ${hovered ? c.borderAccent : c.border}` }}
      >
        <Icon size={18} className="transition-colors duration-700" style={{ color: hovered ? c.accent : c.textSub }} />
      </div>
      <h3 className="text-xs font-normal tracking-[0.4em] uppercase mb-4" style={{ color: c.accent }}>
        {label}
      </h3>
      {children}
    </div>
  );
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLight, colors: c } = useThemeContext();

  useEffect(() => {
    async function fetchData() {
      const data = await getContactInfo();
      setContactInfo(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PageMeta title="联系我们 - LIMIN AUDIO 立敏音响" />
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
        title="联系我们 - LIMIN AUDIO 立敏音响"
        description="联系 LIMIN AUDIO 立敏音响，获取专业音响咨询服务和产品介绍"
        keywords={['联系我们', '音响咨询', '预约试听', 'LIMIN AUDIO']}
      />

      <Header />
      <main className="pt-20">
        <section className="relative py-12 overflow-hidden" style={{ backgroundColor: c.bg }}>
          <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-[10px] font-normal tracking-[0.4em] uppercase mb-4" style={{ color: `${c.accent}99` }}>
                Contact Us
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.1em] mb-4" style={{ color: c.text }}>
                联系我们
              </h1>
              <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` }} />
              <p className="font-light max-w-xl mx-auto tracking-[0.05em] text-base leading-relaxed" style={{ color: c.textMuted }}>
                我们期待与您交流，为您提供专业的音响咨询服务
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: c.bg }}>
          <div className="max-w-[800px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center gap-6 mb-10">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${c.border})` }} />
                <p className="text-[10px] font-normal tracking-[0.4em] uppercase" style={{ color: `${c.accent}99` }}>About Us</p>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${c.border})` }} />
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              {contactInfo?.intro_text ? (
                <div
                  className={`text-sm font-light leading-[1.9] tracking-[0.02em] prose max-w-none ${isLight ? '' : 'prose-invert'}`}
                  style={{ color: c.textMuted }}
                  dangerouslySetInnerHTML={{ __html: contactInfo.intro_text }}
                />
              ) : (
                <div className="space-y-6 text-sm font-light leading-[1.9] tracking-[0.02em]" style={{ color: c.textMuted }}>
                  <p>
                    我们在中国领导高端音频业务超过 25 年，提供来自各大洲的最佳设备，提供最先进的 Hi-End 音频体验，与客户分享对音乐艺术的热情。
                  </p>
                  <p>
                    我们追求最好的音频性能。我们选择和分销世界级品牌和组件，采用新技术和制作定制服务，以确保我们的客户能够在他们的聆听环境中体验高保真音乐再现。
                  </p>
                  <p>
                    我们在上海设有工作室和展示厅，在中国各地设有经销商。
                  </p>
                  <p>
                    无论您是在寻找音响系统还是家庭影院，一体化系统或模拟转盘，我们随时为您提供帮助。我们的目标是引导您，让您轻松选择音乐系统，无论您的预算如何。
                  </p>
                </div>
              )}
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: c.bgAlt }}>
          <div className="max-w-[1400px] mx-auto px-8">
            <ScrollAnimation>
              <div className="flex items-center gap-6 mb-10">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${c.border})` }} />
                <p className="text-[10px] font-normal tracking-[0.4em] uppercase" style={{ color: `${c.accent}99` }}>Get In Touch</p>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${c.border})` }} />
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation delay={0}>
                <ContactCard icon={FaPhone} label="电话咨询" c={c}>
                  <p className="text-lg font-extralight tracking-[0.05em]" style={{ color: c.text }}>
                    {contactInfo?.phone || '0086-21-56317880'}
                  </p>
                </ContactCard>
              </ScrollAnimation>

              <ScrollAnimation delay={100}>
                <ContactCard icon={FaEnvelope} label="邮箱联系" c={c}>
                  <p className="text-lg font-extralight tracking-[0.05em]" style={{ color: c.text }}>
                    {contactInfo?.email || 'info@liminaudio.com'}
                  </p>
                </ContactCard>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <ContactCard icon={FaMapMarkerAlt} label="地址" c={c}>
                  <p className="text-lg font-extralight tracking-[0.05em] leading-relaxed" style={{ color: c.text }}>
                    {contactInfo?.address || '上海市黄浦区南苏州路 933 号 103 室'}
                  </p>
                </ContactCard>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {contactInfo?.map_url && (
          <section className="py-16" style={{ backgroundColor: c.bg }}>
            <div className="max-w-[1400px] mx-auto px-8">
              <ScrollAnimation>
                <div className="aspect-[21/9] overflow-hidden" style={{ backgroundColor: c.bgAlt }}>
                  <img
                    src={contactInfo.map_url}
                    alt="工作室位置"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
