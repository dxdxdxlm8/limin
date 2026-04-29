-- ============================================
-- 更新 brand_info 表的注释，使其与 product_categories 格式一致
-- ============================================
COMMENT ON TABLE brand_info IS '{"chinese_title": "品牌信息表", "english_title": "Brand Info", "chinese_description": "存储代理音响品牌的详细信息，包括品牌故事、产品介绍等", "english_description": "Stores detailed information of audio brands including brand story, products etc", "widget": "select", "display_field": "name"}';
