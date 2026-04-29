import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { Header } from '@/components/generated/Header';
import { Footer } from '@/components/generated/Footer';
import { ScrollAnimation } from '@/components/generated/ScrollAnimation';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { getContactInfo, type ContactInfo } from '@/lib/queries';

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
        title="联系我们 - LIMIN AUDIO 立敏音响"
        description="联系 LIMIN AUDIO 立敏音响，获取专业音响咨询服务和产品介绍"
        keywords={['联系我们', '音响咨询', '预约试听', 'LIMIN AUDIO']} />

      <Header />
      <main className="pt-20">
        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-[1920px] mx-auto px-8 text-center">
            <ScrollAnimation>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">CONTACT US</p>
              <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6">
                联系我们
              </h1>
              <div className="w-12 h-px bg-white/20 mx-auto" />
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto">
                {contactInfo?.intro_text ? (
                  <div
                    className="text-sm font-light text-gray-400 leading-relaxed tracking-[0.05em] prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: contactInfo.intro_text }}
                  />
                ) : (
                  <div className="space-y-8 text-sm font-light text-gray-400 leading-relaxed tracking-[0.05em]">
                    <p className="text-base">
                      我们在中国领导高端音频业务超过 25 年，提供来自各大洲的最佳设备，提供最先进的 Hi-End 音频体验，与客户分享对音乐艺术的热情。
                    </p>
                    <p className="text-base">
                      我们追求最好的音频性能。我们选择和分销世界级品牌和组件，采用新技术和制作定制服务，以确保我们的客户能够在他们的聆听环境中体验高保真音乐再现。
                    </p>
                    <p className="text-base">
                      我们在上海设有工作室和展示厅，在中国各地设有经销商。
                    </p>
                    <p className="text-base">
                      我们所有的产品都经过精心挑选，代表了我们制造商的性能和支持的巅峰。
                    </p>
                    <p className="text-base">
                      无论您是在寻找音响系统还是家庭影院，一体化系统或模拟转盘，我们随时为您提供帮助。我们的目标是引导您，让您轻松选择音乐系统，无论您的预算如何。
                    </p>
                    <p className="text-white text-base">
                      如果您有任何疑问，请联系我们。
                    </p>
                  </div>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-[1920px] mx-auto px-8">
            <ScrollAnimation>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center p-10 bg-black hover:bg-white/[0.02] transition-all duration-700">
                  <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                    <FaPhone className="text-white" size={20} />
                  </div>
                  <h3 className="font-light tracking-[0.2em] uppercase text-white mb-4 text-base">
                    电话咨询
                  </h3>
                  <p className="text-lg font-extralight text-white mb-2">
                    {contactInfo?.phone || '0086-21-56317880'}
                  </p>
                </div>

                <div className="text-center p-10 bg-black hover:bg-white/[0.02] transition-all duration-700">
                  <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white" size={20} />
                  </div>
                  <h3 className="font-light tracking-[0.2em] uppercase text-white mb-4 text-base">
                    邮箱联系
                  </h3>
                  <p className="text-lg font-extralight text-white">
                    {contactInfo?.email || 'info@liminaudio.com'}
                  </p>
                </div>

                <div className="text-center p-10 bg-black hover:bg-white/[0.02] transition-all duration-700">
                  <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white" size={20} />
                  </div>
                  <h3 className="font-light tracking-[0.2em] uppercase text-white mb-4 text-base">
                    地址
                  </h3>
                  <p className="text-sm font-light text-gray-400">
                    {contactInfo?.address || '上海市黄浦区南苏州路 933 号 103 室'}
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {contactInfo?.map_url &&
        <section className="py-20 bg-black">
            <div className="max-w-[1920px] mx-auto px-8">
              <ScrollAnimation>
                <div className="aspect-[21/9] bg-white/5">
                  <img
                  src={contactInfo.map_url}
                  alt="工作室位置"
                  className="w-full h-full object-cover" />

                </div>
              </ScrollAnimation>
            </div>
          </section>
        }
      </main>
      <Footer />
    </>);

}
