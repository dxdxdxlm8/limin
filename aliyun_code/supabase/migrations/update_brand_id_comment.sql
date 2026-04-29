-- ============================================
-- 更新 products 表 brand_id 字段的注释，让管理后台显示更友好
-- ============================================
COMMENT ON COLUMN products.brand_id IS '{"chinese_title": "所属品牌", "english_title": "Brand", "chinese_description": "选择产品所属的品牌", "english_description": "Select the brand this product belongs to", "format": "uuid"}';
