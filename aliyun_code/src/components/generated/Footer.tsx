import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWeixin, FaWeibo } from 'react-icons/fa';
import { getContactInfo, getSiteConfig, type ContactInfo, type SiteConfigFromAPI } from '@/lib/queries';

export function Footer() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfigFromAPI | null>(null);

  const isLight = siteConfig?.theme === 'light';
  const accentColor = siteConfig?.accentColor || (isLight ? '#8B7355' : '#C9A96E');

  useEffect(() => {
    getContactInfo().then(setContact);
    getSiteConfig().then(setSiteConfig);
  }, []);

  return (
    <footer
      className="relative border-t"
      style={{
        backgroundColor: isLight ? '#EBE4D9' : '#030303',
        borderColor: isLight ? 'rgba(139,115,85,0.10)' : 'rgba(255,255,255,0.04)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentColor}4D, transparent)` }} />

      <div className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="LIMIN AUDIO"
                className="h-12 w-auto object-contain mb-8"
                style={{ opacity: isLight ? 0.9 : 0.8 }}
              />
            ) : (
              <div className={`text-2xl font-extralight tracking-[0.3em] mb-8 ${isLight ? 'text-[#2C2418]' : 'text-white'}`}>
                LIMIN <span className="font-light">AUDIO</span>
              </div>
            )}
            <p className={`text-base font-light leading-[1.8] tracking-[0.05em] max-w-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              25 年专注高端音频，连接全球顶级音响品牌与中国发烧友。我们致力于为您呈现最纯粹的声音体验。
            </p>

            {(contact?.social_wechat || contact?.social_weibo) && (
              <div className="flex gap-4 mt-8">
                {contact?.social_wechat && (
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer"
                    style={{
                      border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                      color: isLight ? '#999' : '#4B5563',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.borderColor = `${accentColor}4D`; }}
                    onMouseOut={e => { e.currentTarget.style.color = isLight ? '#999' : '#4B5563'; e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'; }}
                    title={`微信: ${contact.social_wechat}`}
                  >
                    <FaWeixin className="w-4 h-4" />
                  </span>
                )}
                {contact?.social_weibo && (
                  <a
                    href={contact.social_weibo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                      color: isLight ? '#999' : '#4B5563',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.borderColor = `${accentColor}4D`; }}
                    onMouseOut={e => { e.currentTarget.style.color = isLight ? '#999' : '#4B5563'; e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'; }}
                  >
                    <FaWeibo className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-normal tracking-[0.3em] uppercase mb-8" style={{ color: accentColor }}>
              导航
            </h4>
            <ul className="space-y-4">
              {[
                { path: '/products', label: '产品中心' },
                { path: '/brands', label: '品牌中心' },
                { path: '/news', label: '新闻中心' },
                { path: '/contact', label: '联系我们' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-base font-light transition-colors duration-500 tracking-[0.05em] ${isLight ? 'text-gray-600' : 'text-gray-300'}`}
                    onMouseOver={e => e.currentTarget.style.color = accentColor}
                    onMouseOut={e => e.currentTarget.style.color = ''}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-normal tracking-[0.3em] uppercase mb-8" style={{ color: accentColor }}>
              联系方式
            </h4>
            <ul className={`space-y-4 text-base font-light tracking-[0.05em] ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              {contact?.phone && (
                <li className="flex items-start gap-3">
                  <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>T</span>
                  <span>{contact.phone}</span>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-start gap-3">
                  <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>E</span>
                  <span>{contact.email}</span>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-3">
                  <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>A</span>
                  <span className="leading-relaxed">{contact.address}</span>
                </li>
              )}
              {!contact && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>T</span>
                    <span>+86 400-888-8888</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>E</span>
                    <span>info@liminaudio.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xs mt-1" style={{ color: `${accentColor}66` }}>A</span>
                    <span className="leading-relaxed">上海市黄浦区淮海中路 888 号</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div
          className="mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'}` }}
        >
          <p className={`text-xs font-light tracking-[0.1em] ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; 2026 LIMIN AUDIO. All rights reserved.
          </p>
          <p className={`text-xs font-light tracking-[0.1em] ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            沪 ICP 备 12345678 号
          </p>
        </div>
      </div>
    </footer>
  );
}
