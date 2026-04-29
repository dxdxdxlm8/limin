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

  const accentColor = siteConfig?.accentColor || '#C9A96E';

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
      return hoveredIndex === index ? 'text-[#C9A96E]' : 'text-gray-300';
    }
    return isActive(path) ? 'text-white' : 'text-gray-300';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-4 group">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="LIMIN AUDIO"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="text-2xl font-extralight text-white tracking-[0.25em]">
                LIMIN <span className="font-light">AUDIO</span>
              </div>
            )}
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-8 relative">
            <Link
              to="/"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 ${getTextColor(0, '/')}`}
            >
              首页
            </Link>

            <DropdownMenu
              trigger={
                <button
                  onMouseEnter={() => setHoveredIndex(1)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`nav-item flex items-center gap-2 text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 ${getTextColor(1, '/brands')}`}
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
                  className={`nav-item flex items-center gap-2 text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 ${getTextColor(2, '/products')}`}
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
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 ${getTextColor(3, '/news')}`}
            >
              新闻
            </Link>

            <Link
              to="/contact"
              onMouseEnter={() => setHoveredIndex(4)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`nav-item text-base font-normal tracking-[0.2em] uppercase transition-all duration-300 py-4 ${getTextColor(4, '/contact')}`}
            >
              联系
            </Link>
          </nav>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <nav className="flex flex-col px-8 py-6 gap-6">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-light tracking-[0.15em] ${
                isActive('/') ? 'text-white' : 'text-gray-400'
              }`}
            >
              首页
            </Link>
            <Link
              to="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-light tracking-[0.15em] ${
                isActive('/brands') ? 'text-white' : 'text-gray-400'
              }`}
            >
              品牌
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-light tracking-[0.15em] ${
                isActive('/products') ? 'text-white' : 'text-gray-400'
              }`}
            >
              产品
            </Link>
            <Link
              to="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-light tracking-[0.15em] ${
                isActive('/news') ? 'text-white' : 'text-gray-400'
              }`}
            >
              新闻
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-light tracking-[0.15em] ${
                isActive('/contact') ? 'text-white' : 'text-gray-400'
              }`}
            >
              联系
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
