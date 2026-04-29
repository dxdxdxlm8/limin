-- ============================================
-- 修改产品与品牌的关联方式：从 UUID 改为品牌名称
-- ============================================

-- 1. 添加 brand_name 字段
ALTER TABLE products ADD COLUMN brand_name TEXT;

-- 2. 将现有 brand_id 的数据转换为 brand_name
UPDATE products
SET brand_name = (
  SELECT name FROM brand_info WHERE brand_info.id = products.brand_id
)
WHERE brand_id IS NOT NULL;

-- 3. 删除 brand_id 字段和外键约束
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;
ALTER TABLE products DROP COLUMN IF EXISTS brand_id;

-- 4. 为 brand_name 添加索引
CREATE INDEX idx_products_brand_name ON products(brand_name);

-- 5. 更新 brand_name 字段注释
COMMENT ON COLUMN products.brand_name IS '{"chinese_title": "所属品牌", "english_title": "Brand Name", "chinese_description": "产品所属的品牌名称", "english_description": "Name of the brand this product belongs to"}';
