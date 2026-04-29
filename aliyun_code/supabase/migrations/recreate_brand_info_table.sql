-- ============================================
-- 重新创建 brand_info 表，确保管理后台正确识别
-- ============================================

-- 备份现有数据
CREATE TEMP TABLE brand_info_backup AS SELECT * FROM brand_info;

-- 先删除 products 表的外键约束
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;

-- 删除旧表
DROP TABLE brand_info CASCADE;

-- 重新创建表，参考 product_categories 的结构
CREATE TABLE brand_info (
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
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  slug TEXT
);

-- 添加表注释
COMMENT ON TABLE brand_info IS '{"chinese_title": "品牌信息表", "english_title": "Brand Info", "chinese_description": "存储代理音响品牌的详细信息，包括品牌故事、产品介绍等", "english_description": "Stores detailed information of audio brands including brand story, products etc"}';

-- 添加列注释
COMMENT ON COLUMN brand_info.id IS '{"chinese_title": "品牌 ID", "english_title": "Brand ID", "chinese_description": "品牌的唯一标识符", "english_description": "Unique identifier for brand"}';
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
COMMENT ON COLUMN brand_info.slug IS '{"chinese_title": "URL 别名", "english_title": "URL Slug", "chinese_description": "URL 友好的品牌标识符，用于生成 SEO 友好的 URL 路径", "english_description": "URL-friendly brand identifier, used to generate SEO-friendly URL paths"}';

-- 创建索引
CREATE INDEX idx_brand_info_display_order ON brand_info(display_order);
CREATE INDEX idx_brand_info_is_deleted ON brand_info(is_deleted);
CREATE INDEX idx_brand_info_is_featured ON brand_info(is_featured);

-- 恢复数据
INSERT INTO brand_info SELECT * FROM brand_info_backup;

-- 启用 RLS
ALTER TABLE brand_info ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
DROP POLICY IF EXISTS "brand_info_select_all" ON brand_info;
CREATE POLICY "brand_info_select_all" ON brand_info FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS "brand_info_insert_authenticated" ON brand_info;
CREATE POLICY "brand_info_insert_authenticated" ON brand_info FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "brand_info_update_authenticated" ON brand_info;
CREATE POLICY "brand_info_update_authenticated" ON brand_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "brand_info_delete_authenticated" ON brand_info;
CREATE POLICY "brand_info_delete_authenticated" ON brand_info FOR DELETE TO authenticated USING (true);

-- 授予权限
GRANT SELECT ON brand_info TO anon, authenticated;
GRANT ALL ON brand_info TO authenticated;

-- 创建触发器
CREATE TRIGGER update_brand_info_updated_at
  BEFORE UPDATE ON brand_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();

-- 重新添加 products 表的外键约束
ALTER TABLE products
ADD CONSTRAINT products_brand_id_fkey
FOREIGN KEY (brand_id) REFERENCES brand_info(id) ON DELETE SET NULL;

-- 添加 brand_id 字段注释
COMMENT ON COLUMN products.brand_id IS '{"chinese_title": "所属品牌", "english_title": "Brand", "chinese_description": "选择产品所属的品牌", "english_description": "Select the brand this product belongs to"}';
