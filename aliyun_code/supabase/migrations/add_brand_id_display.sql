-- ============================================
-- 为 brand_info 表的 id 字段添加更友好的注释，让管理后台显示
-- ============================================
COMMENT ON COLUMN brand_info.id IS '{"chinese_title": "品牌 ID", "english_title": "Brand ID", "chinese_description": "品牌的唯一标识符，用于产品关联", "english_description": "Unique identifier for brand, used for product association", "format": "uuid", "display_in_list": true}';
