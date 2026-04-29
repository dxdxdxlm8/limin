-- ============================================
-- 为 products 表添加 brand_id 外键字段
-- ============================================

-- 添加 brand_id 字段
ALTER TABLE products
ADD COLUMN brand_id uuid DEFAULT NULL;

-- 添加外键约束
ALTER TABLE products
ADD CONSTRAINT products_brand_id_fkey
FOREIGN KEY (brand_id) REFERENCES brand_info(id) ON DELETE SET NULL;

-- 添加字段注释，让管理后台显示更友好
COMMENT ON COLUMN products.brand_id IS '{"chinese_title": "所属品牌", "english_title": "Brand", "chinese_description": "选择产品所属的品牌", "english_description": "Select the brand this product belongs to", "format": "uuid"}';
