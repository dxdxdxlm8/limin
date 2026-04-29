-- ============================================
-- LIMIN AUDIO 官网数据库表结构
-- ============================================
-- 删除旧表和函数
DROP TRIGGER IF EXISTS update_home_settings_updated_at ON home_settings;
DROP TRIGGER IF EXISTS update_brand_info_updated_at ON brand_info;
DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
DROP TABLE IF EXISTS home_settings CASCADE;
DROP TABLE IF EXISTS brand_info CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP FUNCTION IF EXISTS update_updated_x_at_column() CASCADE;
-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_x_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 首页配置表
CREATE TABLE IF NOT EXISTS home_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  stats_25_years_title TEXT,
  stats_25_years_value TEXT DEFAULT '25+',
  stats_brands_title TEXT,
  stats_brands_value TEXT DEFAULT '50+',
  stats_customers_title TEXT,
  stats_customers_value TEXT DEFAULT '10000+',
  philosophy_title TEXT,
  philosophy_subtitle TEXT,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE home_settings IS '{"chinese_title": "首页配置表", "english_title": "Home Settings", "chinese_description": "存储首页各区块的配置信息，包括 Hero 区、数据统计区、品牌理念区等", "english_description": "Stores configuration for homepage sections including Hero, Stats, Philosophy sections"}';
COMMENT ON COLUMN home_settings.id IS '{"chinese_title": "配置 ID", "english_title": "Setting ID", "chinese_description": "配置记录的唯一标识符", "english_description": "Unique identifier for setting record", "format": "uuid"}';
COMMENT ON COLUMN home_settings.hero_title IS '{"chinese_title": "Hero 标题", "english_title": "Hero Title", "chinese_description": "首页 Hero 区的主标题", "english_description": "Main title of homepage Hero section"}';
COMMENT ON COLUMN home_settings.hero_subtitle IS '{"chinese_title": "Hero 副标题", "english_title": "Hero Subtitle", "chinese_description": "首页 Hero 区的副标题/说明文字", "english_description": "Subtitle/description text of homepage Hero section"}';
COMMENT ON COLUMN home_settings.hero_image_url IS '{"chinese_title": "Hero 图片", "english_title": "Hero Image", "chinese_description": "首页 Hero 区的背景图片 URL", "english_description": "Background image URL for homepage Hero section", "format": "image"}';
COMMENT ON COLUMN home_settings.stats_25_years_title IS '{"chinese_title": "25 年经验标题", "english_title": "25 Years Title", "chinese_description": "数据统计区 25 年经验的标题文字", "english_description": "Title text for 25 years experience stat"}';
COMMENT ON COLUMN home_settings.stats_25_years_value IS '{"chinese_title": "25 年经验数值", "english_title": "25 Years Value", "chinese_description": "数据统计区 25 年经验的显示数值", "english_description": "Display value for 25 years experience stat"}';
COMMENT ON COLUMN home_settings.stats_brands_title IS '{"chinese_title": "合作品牌标题", "english_title": "Brands Title", "chinese_description": "数据统计区全球合作品牌的标题文字", "english_description": "Title text for global brands stat"}';
COMMENT ON COLUMN home_settings.stats_brands_value IS '{"chinese_title": "合作品牌数值", "english_title": "Brands Value", "chinese_description": "数据统计区全球合作品牌的显示数值", "english_description": "Display value for global brands stat"}';
COMMENT ON COLUMN home_settings.stats_customers_title IS '{"chinese_title": "服务客户标题", "english_title": "Customers Title", "chinese_description": "数据统计区服务客户的标题文字", "english_description": "Title text for served customers stat"}';
COMMENT ON COLUMN home_settings.stats_customers_value IS '{"chinese_title": "服务客户数值", "english_title": "Customers Value", "chinese_description": "数据统计区服务客户的显示数值", "english_description": "Display value for served customers stat"}';
COMMENT ON COLUMN home_settings.philosophy_title IS '{"chinese_title": "理念标题", "english_title": "Philosophy Title", "chinese_description": "品牌理念区的主标题", "english_description": "Main title of brand philosophy section"}';
COMMENT ON COLUMN home_settings.philosophy_subtitle IS '{"chinese_title": "理念副标题", "english_title": "Philosophy Subtitle", "chinese_description": "品牌理念区的副标题", "english_description": "Subtitle of brand philosophy section"}';
COMMENT ON COLUMN home_settings.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该配置是否已被删除", "english_description": "Marks whether this setting has been deleted"}';
COMMENT ON COLUMN home_settings.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录配置被删除的时间", "english_description": "Timestamp when setting was deleted", "format": "date-time"}';
COMMENT ON COLUMN home_settings.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "配置记录的创建时间", "english_description": "Creation timestamp of setting record", "format": "date-time"}';
COMMENT ON COLUMN home_settings.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "配置记录的最后更新时间", "english_description": "Last update timestamp of setting record", "format": "date-time"}';
-- 品牌信息表
CREATE TABLE IF NOT EXISTS brand_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  country TEXT,
  description TEXT,
  long_description TEXT,
  story TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE brand_info IS '{"chinese_title": "品牌信息表", "english_title": "Brand Info", "chinese_description": "存储代理音响品牌的详细信息，包括品牌故事、产品介绍等", "english_description": "Stores detailed information of audio brands including brand story, products etc"}';
COMMENT ON COLUMN brand_info.id IS '{"chinese_title": "品牌 ID", "english_title": "Brand ID", "chinese_description": "品牌的唯一标识符", "english_description": "Unique identifier for brand", "format": "uuid"}';
COMMENT ON COLUMN brand_info.name IS '{"chinese_title": "品牌名称", "english_title": "Brand Name", "chinese_description": "品牌的中文名称", "english_description": "Chinese name of brand"}';
COMMENT ON COLUMN brand_info.name_en IS '{"chinese_title": "英文名称", "english_title": "English Name", "chinese_description": "品牌的英文名称", "english_description": "English name of brand"}';
COMMENT ON COLUMN brand_info.country IS '{"chinese_title": "国家", "english_title": "Country", "chinese_description": "品牌所属国家", "english_description": "Country of origin for brand"}';
COMMENT ON COLUMN brand_info.description IS '{"chinese_title": "品牌简介", "english_title": "Description", "chinese_description": "品牌的简短介绍", "english_description": "Brief introduction of brand"}';
COMMENT ON COLUMN brand_info.long_description IS '{"chinese_title": "详细介绍", "english_title": "Long Description", "chinese_description": "品牌的详细介绍", "english_description": "Detailed description of brand"}';
COMMENT ON COLUMN brand_info.story IS '{"chinese_title": "品牌故事", "english_title": "Brand Story", "chinese_description": "品牌的历史和故事", "english_description": "History and story of brand"}';
COMMENT ON COLUMN brand_info.image_url IS '{"chinese_title": "品牌图片", "english_title": "Brand Image", "chinese_description": "品牌的展示图片 URL", "english_description": "Display image URL for brand", "format": "image"}';
COMMENT ON COLUMN brand_info.display_order IS '{"chinese_title": "显示顺序", "english_title": "Display Order", "chinese_description": "品牌列表的排序权重", "english_description": "Sort weight for brand list"}';
COMMENT ON COLUMN brand_info.is_featured IS '{"chinese_title": "精选标记", "english_title": "Featured Flag", "chinese_description": "标记是否为精选品牌", "english_description": "Marks whether this is a featured brand"}';
COMMENT ON COLUMN brand_info.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该品牌是否已被删除", "english_description": "Marks whether this brand has been deleted"}';
COMMENT ON COLUMN brand_info.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录品牌被删除的时间", "english_description": "Timestamp when brand was deleted", "format": "date-time"}';
COMMENT ON COLUMN brand_info.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "品牌记录的创建时间", "english_description": "Creation timestamp of brand record", "format": "date-time"}';
COMMENT ON COLUMN brand_info.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "品牌记录的最后更新时间", "english_description": "Last update timestamp of brand record", "format": "date-time"}';
-- 联系我们配置表
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  company_name_en TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  address_en TEXT,
  map_url TEXT,
  social_wechat TEXT,
  social_weibo TEXT,
  social_linkedin TEXT,
  business_hours TEXT,
  business_hours_en TEXT,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE contact_info IS '{"chinese_title": "联系我们配置表", "english_title": "Contact Info", "chinese_description": "存储联系我们页面的配置信息，包括联系方式、地址、社交媒体等", "english_description": "Stores configuration for contact page including contact details, address, social media etc"}';
COMMENT ON COLUMN contact_info.id IS '{"chinese_title": "配置 ID", "english_title": "Contact ID", "chinese_description": "联系配置的唯一标识符", "english_description": "Unique identifier for contact config", "format": "uuid"}';
COMMENT ON COLUMN contact_info.company_name IS '{"chinese_title": "公司名称", "english_title": "Company Name", "chinese_description": "公司的中文名称", "english_description": "Chinese name of company"}';
COMMENT ON COLUMN contact_info.company_name_en IS '{"chinese_title": "英文公司名", "english_title": "Company Name EN", "chinese_description": "公司的英文名称", "english_description": "English name of company"}';
COMMENT ON COLUMN contact_info.phone IS '{"chinese_title": "联系电话", "english_title": "Phone", "chinese_description": "联系电话号码", "english_description": "Contact phone number"}';
COMMENT ON COLUMN contact_info.email IS '{"chinese_title": "联系邮箱", "english_title": "Email", "chinese_description": "联系邮箱地址", "english_description": "Contact email address", "format": "email"}';
COMMENT ON COLUMN contact_info.address IS '{"chinese_title": "中文地址", "english_title": "Address CN", "chinese_description": "公司的中文地址", "english_description": "Chinese address of company"}';
COMMENT ON COLUMN contact_info.address_en IS '{"chinese_title": "英文地址", "english_title": "Address EN", "chinese_description": "公司的英文地址", "english_description": "English address of company"}';
COMMENT ON COLUMN contact_info.map_url IS '{"chinese_title": "地图 URL", "english_title": "Map URL", "chinese_description": "地图嵌入 URL 或链接", "english_description": "Map embed URL or link"}';
COMMENT ON COLUMN contact_info.social_wechat IS '{"chinese_title": "微信", "english_title": "WeChat", "chinese_description": "微信公众号或二维码", "english_description": "WeChat official account or QR code"}';
COMMENT ON COLUMN contact_info.social_weibo IS '{"chinese_title": "微博", "english_title": "Weibo", "chinese_description": "微博账号或链接", "english_description": "Weibo account or link"}';
COMMENT ON COLUMN contact_info.social_linkedin IS '{"chinese_title": "领英", "english_title": "LinkedIn", "chinese_description": "领英公司主页链接", "english_description": "LinkedIn company page link"}';
COMMENT ON COLUMN contact_info.business_hours IS '{"chinese_title": "营业时间", "english_title": "Business Hours CN", "chinese_description": "中文营业时间", "english_description": "Chinese business hours text"}';
COMMENT ON COLUMN contact_info.business_hours_en IS '{"chinese_title": "英文营业时间", "english_title": "Business Hours EN", "chinese_description": "英文营业时间", "english_description": "English business hours text"}';
COMMENT ON COLUMN contact_info.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该配置是否已被删除", "english_description": "Marks whether this config has been deleted"}';
COMMENT ON COLUMN contact_info.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录配置被删除的时间", "english_description": "Timestamp when config was deleted", "format": "date-time"}';
COMMENT ON COLUMN contact_info.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "配置记录的创建时间", "english_description": "Creation timestamp of config record", "format": "date-time"}';
COMMENT ON COLUMN contact_info.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "配置记录的最后更新时间", "english_description": "Last update timestamp of config record", "format": "date-time"}';
-- 创建触发器
CREATE TRIGGER update_home_settings_updated_at
  BEFORE UPDATE ON home_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
CREATE TRIGGER update_brand_info_updated_at
  BEFORE UPDATE ON brand_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
-- 插入测试数据
INSERT INTO home_settings (hero_title, hero_subtitle, hero_image_url, stats_25_years_title, stats_brands_title, stats_customers_title, philosophy_title, philosophy_subtitle) VALUES
  ('通往最好的声音和音乐', '25 年专注高端音频，连接全球顶级音响品牌与中国发烧友', 'https://baas-api.wanwang.xin/toc/image/preview/luxury-hifi-audio-showroom-dark.jpg?w=1920&h=1080&q=90', '年行业经验', '全球合作品牌', '服务客户', '对音质追求的执着', '我们很自豪在中国领导高端音频业务超过 25 年');
INSERT INTO brand_info (name, name_en, country, description, long_description, story, image_url, display_order, is_featured) VALUES
  ('Ayon Audio', 'Ayon Audio', '波兰', '波兰顶级电子管音响制造商', 'Ayon Audio 是波兰顶级电子管音响制造商，专注于生产高端电子管放大器、解码器和数字播放器。', 'Ayon Audio 成立于 2006 年，由一群热爱电子管技术的波兰工程师创立。', 'https://baas-api.wanwang.xin/toc/image/preview/ayon-audio-factory-workshop.jpg?w=1200&h=600&q=90', 1, true),
  ('BAT', 'Balanced Audio Technology', '美国', '美国 Balanced Audio Technology 高端音响', 'BAT 是美国高端音响品牌，以其全平衡电路设计和卓越的音质表现著称。', 'BAT 成立于 1995 年，总部位于美国加利福尼亚州。', 'https://baas-api.wanwang.xin/toc/image/preview/bat-audio-facility-display.jpg?w=1200&h=600&q=90', 2, true),
  ('Benchmark', 'Benchmark', '美国', '美国专业音频设备领导品牌', 'Benchmark 是美国专业音频设备领导品牌，产品广泛应用于专业录音室和高端发烧音响系统。', 'Benchmark 成立于 1986 年，最初专注于专业录音室设备。', 'https://baas-api.wanwang.xin/toc/image/preview/benchmark-studio-professional.jpg?w=1200&h=600&q=90', 3, true),
  ('Ryan', 'Ryan Speaker', '美国', '高端扬声器系统专家', 'Ryan Speaker 是高端扬声器系统专家，专注于生产顶级书架式和落地式扬声器。', 'Ryan Speaker 由资深扬声器设计师 Ryan 先生创立于 2005 年。', 'https://baas-api.wanwang.xin/toc/image/preview/ryan-speakers-workshop-craft.jpg?w=1200&h=600&q=90', 4, true),
  ('Lyravox', 'Lyravox', '德国', '德国高端音响系统品牌', 'Lyravox 是德国高端音响系统品牌，专注于生产一体化智能音响系统。', 'Lyravox 成立于 2010 年，总部位于德国慕尼黑。', 'https://baas-api.wanwang.xin/toc/image/preview/lyravox-german-engineering.jpg?w=1200&h=600&q=90', 5, true),
  ('MSB', 'MSB Technology', '美国', '美国顶级数字音频转换器制造商', 'MSB Technology 是美国顶级数字音频转换器制造商，以其独家的分立电阻 ladder DAC 技术闻名。', 'MSB Technology 成立于 1992 年，由一群对数字音频转换技术充满热情的工程师创立。', 'https://baas-api.wanwang.xin/toc/image/preview/msb-technology-lab-research.jpg?w=1200&h=600&q=90', 6, true);
INSERT INTO contact_info (company_name, company_name_en, phone, email, address, address_en, business_hours, business_hours_en) VALUES
  ('立敏音响', 'LIMIN AUDIO', '400-888-8888', 'info@liminaudio.com', '上海市徐汇区音响大厦 88 号', 'No.88 Audio Building, Xuhui District, Shanghai', '周一至周五 9:00-18:00', 'Mon-Fri 9:00-18:00');
-- 启用 RLS
ALTER TABLE home_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
-- 创建策略
DROP POLICY IF EXISTS "select_all" ON home_settings;
CREATE POLICY "select_all" ON home_settings FOR SELECT TO anon, authenticated USING (is_deleted = false);
DROP POLICY IF EXISTS "insert_all" ON home_settings;
CREATE POLICY "insert_all" ON home_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_all" ON home_settings;
CREATE POLICY "update_all" ON home_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_all" ON home_settings;
CREATE POLICY "delete_all" ON home_settings FOR DELETE TO authenticated USING (true);
DROP POLICY IF EXISTS "select_all" ON brand_info;
CREATE POLICY "select_all" ON brand_info FOR SELECT TO anon, authenticated USING (is_deleted = false);
DROP POLICY IF EXISTS "insert_all" ON brand_info;
CREATE POLICY "insert_all" ON brand_info FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_all" ON brand_info;
CREATE POLICY "update_all" ON brand_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_all" ON brand_info;
CREATE POLICY "delete_all" ON brand_info FOR DELETE TO authenticated USING (true);
DROP POLICY IF EXISTS "select_all" ON contact_info;
CREATE POLICY "select_all" ON contact_info FOR SELECT TO anon, authenticated USING (is_deleted = false);
DROP POLICY IF EXISTS "insert_all" ON contact_info;
CREATE POLICY "insert_all" ON contact_info FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_all" ON contact_info;
CREATE POLICY "update_all" ON contact_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_all" ON contact_info;
CREATE POLICY "delete_all" ON contact_info FOR DELETE TO authenticated USING (true);
-- 授予权限
GRANT SELECT ON home_settings TO anon, authenticated;
GRANT ALL ON home_settings TO authenticated;
GRANT SELECT ON brand_info TO anon, authenticated;
GRANT ALL ON brand_info TO authenticated;
GRANT SELECT ON contact_info TO anon, authenticated;
GRANT ALL ON contact_info TO authenticated;
