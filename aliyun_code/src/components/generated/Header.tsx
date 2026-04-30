import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { DropdownMenu } from './DropdownMenu';
import { getBrands, getProductCategories, getSiteConfig, type BrandInfo, type SiteConfigFromAPI } from '@/lib/queries';

interface ProductCategory {
  id: string;
  name: string;
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfigFromAPI | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const isLight = siteConfig?.theme === 'light';
  const accentColor = siteConfig?.accentColor || (isLight ? '#8B7355' : '#C9A96E');

  useEffect(() => {
    async function fetchData() {
      const [brandsData, categoriesData, config] = await Promise.all([
        getBrands(),
        getProductCategories(),
        getSiteConfig(),
      ]);
      setBrands(brandsData);
      setProductCategories(categoriesData);
      setSiteConfig(config);
    }
    fetchData();
  }, []);

  const brandDropdownItems = [
    { path: '/brands', label: '全部品牌' },
    ...brands.map((brand) => ({
      path: `/brand/${brand.slug}`,
      label: brand.name,
    })),
  ];

  const productDropdownItems = [
    { path: '/products', label: '全部产品' },
    ...productCategories.map((category) => ({
      path: `/products?category=${category.id}`,
      label: category.name,
    })),
  ];

  const isActive = (path: string) => location.pathname === path;

  const getTextColor = (index: number, path: string) => {
    if (hoveredIndex !== null) {
      return hoveredIndex === index ? `text-[${accentColor}]` : (isLight ? 'text-gray-600' : 'text-gray-300');
    }
    return isActive(path) ? (isLight ? 'text-gray-900' : 'text-white') : (isLight ? 'text-gray-600' : 'text-gray-300');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: isLight ? 'rgba(245,240,232,0.92)' : 'rgba(0,0,0,0.80)',
        borderColor: isLight ? 'rgba(139,115,85,0.10)' : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex items-center py-4">
          <Link to="/" className="flex items-center gap-4 group mr-4">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="LIMIN AUDIO"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className={`text-2xl font-extralight tracking-[0.25em] ${isLight ? 'text-[#2C2418]' : 'text-white'}`}>
                LIMIN <span className="font-light">AUDIO</span>
              </div>
            )}
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-12 relative ml-56">
            <Link
              to="/"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 px-2 ${getTextColor(0, '/')}`}
              style={{ color: hoveredIndex === 0 ? accentColor : undefined }}
            >
              首页
            </Link>

            <DropdownMenu
              trigger={
                <button
                  onMouseEnter={() => setHoveredIndex(1)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`nav-item flex items-center gap-1 text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 px-2`}
                  style={{ color: hoveredIndex === 1 ? accentColor : (isLight ? 'rgb(75 85 99)' : 'rgb(209 213 219)') }}
                >
                  品牌 <FaChevronDown size={8} className="opacity-50" />
                </button>
              }
              items={brandDropdownItems}
            />

            <DropdownMenu
              trigger={
                <button
                  onMouseEnter={() => setHoveredIndex(2)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`nav-item flex items-center gap-1 text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 px-2`}
                  style={{ color: hoveredIndex === 2 ? accentColor : (isLight ? 'rgb(75 85 99)' : 'rgb(209 213 219)') }}
                >
                  产品 <FaChevronDown size={8} className="opacity-50" />
                </button>
              }
              items={productDropdownItems}
            />

            <Link
              to="/news"
              onMouseEnter={() => setHoveredIndex(3)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 px-2 ${getTextColor(3, '/news')}`}
              style={{ color: hoveredIndex === 3 ? accentColor : undefined }}
            >
              新闻
            </Link>

            <Link
              to="/contact"
              onMouseEnter={() => setHoveredIndex(4)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 px-2 ${getTextColor(4, '/contact')}`}
              style={{ color: hoveredIndex === 4 ? accentColor : undefined }}
            >
              联系
            </Link>
          </nav>

          <button
            className={`lg:hidden p-2 ${isLight ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden backdrop-blur-xl border-t"
          style={{
            backgroundColor: isLight ? 'rgba(245,240,232,0.98)' : 'rgba(0,0,0,0.95)',
            borderColor: isLight ? 'rgba(139,115,85,0.10)' : 'rgba(255,255,255,0.05)',
          }}
        >
          <nav className="flex flex-col px-8 py-6 gap-6">
            {[
              { path: '/', label: '首页' },
              { path: '/brands', label: '品牌' },
              { path: '/products', label: '产品' },
              { path: '/news', label: '新闻' },
              { path: '/contact', label: '联系' },
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-light tracking-[0.15em] ${
                  isActive(item.path)
                    ? (isLight ? 'text-gray-900' : 'text-white')
                    : (isLight ? 'text-gray-500' : 'text-gray-400')
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
