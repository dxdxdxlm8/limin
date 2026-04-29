import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWeixin, FaWeibo } from 'react-icons/fa';
import { getContactInfo, getSiteConfig, type ContactInfo, type SiteConfigFromAPI } from '@/lib/queries';

export function Footer() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfigFromAPI | null>(null);

  useEffect(() => {
    getContactInfo().then(setContact);
    getSiteConfig().then(setSiteConfig);
  }, []);

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="LIMIN AUDIO"
                className="h-10 w-auto object-contain mb-6"
              />
            ) : (
              <div className="text-2xl font-extralight text-white tracking-[0.3em] mb-6">
                LIMIN <span className="font-light">AUDIO</span>
              </div>
            )}
            <p className="text-sm font-light text-gray-500 leading-relaxed tracking-[0.1em]">
              25 年专注高端音频，连接全球顶级音响品牌与中国发烧友
            </p>
          </div>

          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 mb-6">快速链接</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm font-light text-gray-500 hover:text-white transition-colors duration-300 tracking-[0.1em]">
                  产品中心
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-sm font-light text-gray-500 hover:text-white transition-colors duration-300 tracking-[0.1em]">
                  品牌中心
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm font-light text-gray-500 hover:text-white transition-colors duration-300 tracking-[0.1em]">
                  新闻中心
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 mb-6">联系方式</h4>
            <ul className="space-y-3 text-sm font-light text-gray-500 tracking-[0.1em]">
              {contact?.phone && <li>电话：{contact.phone}</li>}
              {contact?.email && <li>邮箱：{contact.email}</li>}
              {contact?.address && <li>地址：{contact.address}</li>}
              {!contact && (
                <>
                  <li>电话：+86 400-888-8888</li>
                  <li>邮箱：info@liminaudio.com</li>
                  <li>地址：上海市黄浦区淮海中路 888 号</li>
                </>
              )}
            </ul>
          </div>

          {(contact?.social_wechat || contact?.social_weibo) && (
            <div>
              <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 mb-6">关注我们</h4>
              <div className="flex gap-4">
                {contact?.social_wechat && (
                  <span className="text-gray-500 hover:text-white transition-colors duration-300" title={`微信: ${contact.social_wechat}`}>
                    <FaWeixin className="w-5 h-5" />
                  </span>
                )}
                {contact?.social_weibo && (
                  <a href={contact.social_weibo} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-300">
                    <FaWeibo className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/5 mt-12 pt-12 text-center">
          <p className="text-xs font-light text-gray-600 tracking-[0.15em]">
            &copy; 2026 LIMIN AUDIO. All rights reserved. 沪 ICP 备 12345678 号
          </p>
        </div>
      </div>
    </footer>
  );
}
