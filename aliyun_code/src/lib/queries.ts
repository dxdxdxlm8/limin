import { supabase } from './supabaseClient';

const API_BASE_URL = 'http://localhost:3000';

// 后端 API 返回的首页配置
export interface HomeConfigFromAPI {
  id: number;
  heroSlides: string; // JSON string
  philosophyTitle: string;
  yearsExperience: number;
  globalBrands: number;
  servedCustomers: number;
}

// 解析后的轮播图数据
export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

// 解析后的首页配置
export interface ParsedHomeConfig {
  id: number;
  heroSlides: HeroSlide[];
  philosophyTitle: string;
  yearsExperience: number;
  globalBrands: number;
  servedCustomers: number;
}

export interface HomeSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  stats_25_years_title: string | null;
  stats_25_years_value: string | null;
  stats_brands_title: string | null;
  stats_brands_value: string | null;
  stats_customers_title: string | null;
  stats_customers_value: string | null;
  philosophy_title: string | null;
  philosophy_subtitle: string | null;
}

export interface BrandInfo {
  id: string;
  name: string;
  name_en: string | null;
  country: string | null;
  description: string | null;
  long_description: string | null;
  story: string | null;
  image_url: string | null;   // 品牌封面图（品牌中心列表、详情页使用）
  logo_url: string | null;    // Logo 图（首页精选品牌使用）
  slug: string | null;
  display_order: number | null;
  is_featured: boolean | null;
}

export interface ContactInfo {
  id: string;
  company_name: string | null;
  company_name_en: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  address_en: string | null;
  map_url: string | null;
  social_wechat: string | null;
  social_weibo: string | null;
  social_linkedin: string | null;
  business_hours: string | null;
  business_hours_en: string | null;
  intro_text: string | null;
}

// 从后端 API 获取首页配置
export async function getHomeConfigFromAPI(): Promise<ParsedHomeConfig | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/homeConfig`);
    if (!res.ok) {
      console.error('Failed to fetch home config from API');
      return null;
    }
    const data: HomeConfigFromAPI[] = await res.json();
    if (!data || data.length === 0) {
      return null;
    }
    
    const config = data[0];
    let heroSlides: HeroSlide[] = [];
    
    if (config.heroSlides) {
      try {
        heroSlides = JSON.parse(config.heroSlides);
      } catch (e) {
        console.error('Failed to parse hero slides:', e);
      }
    }
    
    return {
      id: config.id,
      heroSlides,
      philosophyTitle: config.philosophyTitle || '对音质追求的执着',
      yearsExperience: config.yearsExperience || 25,
      globalBrands: config.globalBrands || 50,
      servedCustomers: config.servedCustomers || 10000
    };
  } catch (error) {
    console.error('Error fetching home config:', error);
    return null;
  }
}

export async function getHomeSettings(): Promise<HomeSettings | null> {
  const { data, error } = await supabase
    .from('home_settings')
    .select('*')
    .eq('is_deleted', false)
    .single();

  if (error) {
    console.error('Failed to fetch home settings:', error);
    return null;
  }

  return data;
}

// 后端 API 返回的品牌数据
export interface BrandFromAPI {
  id: number;
  name: string;
  nameEn: string | null;
  country: string | null;
  description: string | null;
  longDescription: string | null;
  story: string | null;
  brandImage: string | null;
  logo: string | null;
  displayOrder: number;
}

export async function getBrands(): Promise<BrandInfo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/brand`);
    if (!res.ok) {
      console.error('Failed to fetch brands from API');
      return [];
    }
    const data: BrandFromAPI[] = await res.json();
    
    // 转换为 BrandInfo 格式
    return data.map(brand => ({
      id: String(brand.id),
      name: brand.name,
      name_en: brand.nameEn,
      country: brand.country,
      description: brand.description,
      long_description: brand.longDescription,
      story: brand.story,
      image_url: brand.brandImage,
      logo_url: brand.logo,
      slug: String(brand.id), // 使用 id 作为 slug
      display_order: brand.displayOrder,
      is_featured: false
    }));
  } catch (error) {
    console.error('Error fetching brands from API:', error);
    return [];
  }
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/contactConfig`);
    if (!res.ok) {
      console.error('Failed to fetch contact config from API');
      return null;
    }
    const data: ContactConfigFromAPI[] = await res.json();
    if (!data || data.length === 0) {
      return null;
    }

    const config = data[0];
    return {
      id: String(config.id),
      company_name: config.companyName,
      company_name_en: config.companyNameEn,
      phone: config.phone,
      email: config.email,
      address: config.address,
      address_en: config.addressEn,
      map_url: config.mapUrl,
      social_wechat: config.wechat,
      social_weibo: config.weibo,
      social_linkedin: null,
      business_hours: config.workingHours,
      business_hours_en: null,
      intro_text: config.introText
    };
  } catch (error) {
    console.error('Error fetching contact config from API:', error);
    return null;
  }
}

export interface Post {
  id: string;
  category_id: string | null;
  title: string;
  slug: string | null;
  summary: string | null;
  content: string | null;
  featured_image_url: string | null;
  status: string;
  published_at: string | null;
  visit_count: number | null;
}

export interface NewsFromAPI {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  imageUrl: string | null;
  slug: string | null;
  publishedAt: string | null;
}

export interface ContactConfigFromAPI {
  id: number;
  companyName: string | null;
  companyNameEn: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  addressEn: string | null;
  mapUrl: string | null;
  workingHours: string | null;
  wechat: string | null;
  weibo: string | null;
  introText: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  brand_name: string | null;
  title: string;
  slug: string | null;
  summary: string | null;
  content: string | null;
  featured_image_url: string | null;
  images: string[] | null; // 其他产品图片
  status: string;
  current_price: number | null;
  is_on_sale: boolean | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
}

export async function getPosts(limit: number = 10): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/news`);
    if (!res.ok) {
      console.error('Failed to fetch news from API');
      return [];
    }
    const data: NewsFromAPI[] = await res.json();

    return data.map(news => ({
      id: String(news.id),
      category_id: null,
      title: news.title,
      slug: news.slug || String(news.id),
      summary: news.summary,
      content: news.content,
      featured_image_url: news.imageUrl,
      status: 'published',
      published_at: news.publishedAt,
      visit_count: null
    }));
  } catch (error) {
    console.error('Error fetching news from API:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/news/${slug}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error('Failed to fetch news from API');
      return null;
    }
    const news: NewsFromAPI = await res.json();

    return {
      id: String(news.id),
      category_id: null,
      title: news.title,
      slug: news.slug || String(news.id),
      summary: news.summary,
      content: news.content,
      featured_image_url: news.imageUrl,
      status: 'published',
      published_at: news.publishedAt,
      visit_count: null
    };
  } catch (error) {
    console.error('Error fetching news from API:', error);
    return null;
  }
}

export async function getProducts(limit: number = 20): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/product`);
    if (!res.ok) {
      console.error('Failed to fetch products from API');
      return [];
    }
    const data: ProductFromAPI[] = await res.json();
    
    // 转换为 Product 格式
    return data.slice(0, limit).map(product => ({
      id: String(product.id),
      category_id: product.categoryId ? String(product.categoryId) : null,
      brand_name: product.brand?.name || null,
      title: product.name,
      slug: String(product.id),
      summary: product.summary,
      content: product.description,
      featured_image_url: product.imageUrl,
      images: product.images ? JSON.parse(product.images) : null,
      status: 'published',
      current_price: null,
      is_on_sale: true
    }));
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

// 后端 API 返回的分类数据
export interface CategoryFromAPI {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/category`);
    if (!res.ok) {
      console.error('Failed to fetch categories from API');
      return [];
    }
    const data: CategoryFromAPI[] = await res.json();
    
    // 转换为 ProductCategory 格式
    return data.map(category => ({
      id: String(category.id),
      name: category.name,
      description: category.description,
      display_order: category.displayOrder
    }));
  } catch (error) {
    console.error('Error fetching categories from API:', error);
    return [];
  }
}

// 后端 API 返回的产品数据
export interface ProductFromAPI {
  id: number;
  name: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  images: string | null; // JSON字符串
  categoryId: number | null;
  brandId: number | null;
  category?: CategoryFromAPI;
  brand?: BrandFromAPI;
}

export async function getBrandBySlug(slug: string): Promise<BrandInfo | null> {
  // slug 实际上是品牌 ID
  try {
    const res = await fetch(`${API_BASE_URL}/api/brand`);
    if (!res.ok) {
      console.error('Failed to fetch brands from API');
      return null;
    }
    const data: BrandFromAPI[] = await res.json();
    const brand = data.find(b => String(b.id) === slug);
    
    if (!brand) return null;
    
    return {
      id: String(brand.id),
      name: brand.name,
      name_en: brand.nameEn,
      country: brand.country,
      description: brand.description,
      long_description: brand.longDescription,
      story: brand.story,
      image_url: brand.brandImage,
      logo_url: brand.logo,
      slug: String(brand.id),
      display_order: brand.displayOrder,
      is_featured: false
    };
  } catch (error) {
    console.error('Error fetching brand from API:', error);
    return null;
  }
}

export async function getProductsByBrandName(brandName: string, limit: number = 20): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/product`);
    if (!res.ok) {
      console.error('Failed to fetch products from API');
      return [];
    }
    const data: ProductFromAPI[] = await res.json();
    
    // 过滤出该品牌的产品
    const filtered = data
      .filter(p => p.brand?.name === brandName)
      .slice(0, limit);
    
    // 转换为 Product 格式
    return filtered.map(product => ({
      id: String(product.id),
      category_id: product.categoryId ? String(product.categoryId) : null,
      brand_name: product.brand?.name || null,
      title: product.name,
      slug: String(product.id),
      summary: product.summary,
      content: product.description,
      featured_image_url: product.imageUrl,
      images: product.images ? JSON.parse(product.images) : null,
      status: 'published',
      current_price: null,
      is_on_sale: true
    }));
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // slug 实际上是产品 ID
  try {
    const res = await fetch(`${API_BASE_URL}/api/product`);
    if (!res.ok) {
      console.error('Failed to fetch products from API');
      return null;
    }
    const data: ProductFromAPI[] = await res.json();
    const product = data.find(p => String(p.id) === slug);
    
    if (!product) return null;
    
    return {
      id: String(product.id),
      category_id: product.categoryId ? String(product.categoryId) : null,
      brand_name: product.brand?.name || null,
      title: product.name,
      slug: String(product.id),
      summary: product.summary,
      content: product.description,
      featured_image_url: product.imageUrl,
      images: product.images ? JSON.parse(product.images) : null,
      status: 'published',
      current_price: null,
      is_on_sale: true
    };
  } catch (error) {
    console.error('Error fetching product from API:', error);
    return null;
  }
}

export interface SiteConfigFromAPI {
  id: number;
  logoUrl: string | null;
  accentColor: string | null;
}

export async function getSiteConfig(): Promise<SiteConfigFromAPI | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/siteConfig`);
    if (!res.ok) {
      console.error('Failed to fetch site config from API');
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching site config from API:', error);
    return null;
  }
}
