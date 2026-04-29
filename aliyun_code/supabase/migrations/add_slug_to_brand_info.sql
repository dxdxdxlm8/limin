-- ============================================
-- 为 brand_info 表添加 slug 字段
-- ============================================
-- 添加 slug 字段
ALTER TABLE brand_info ADD COLUMN IF NOT EXISTS slug TEXT;
-- 添加唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_info_slug ON brand_info(slug);
-- 添加列注释
COMMENT ON COLUMN brand_info.slug IS '{"chinese_title": "URL 别名", "english_title": "URL Slug", "chinese_description": "URL 友好的品牌标识符，用于生成 SEO 友好的 URL 路径", "english_description": "URL-friendly brand identifier, used to generate SEO-friendly URL paths"}';
-- 为现有数据生成 slug
UPDATE brand_info SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
-- 更新测试数据
UPDATE brand_info SET slug = 'ayon-audio' WHERE name = 'Ayon Audio';
UPDATE brand_info SET slug = 'bat' WHERE name = 'BAT';
UPDATE brand_info SET slug = 'benchmark' WHERE name = 'Benchmark';
UPDATE brand_info SET slug = 'ryan' WHERE name = 'Ryan';
UPDATE brand_info SET slug = 'lyravox' WHERE name = 'Lyravox';
UPDATE brand_info SET slug = 'msb' WHERE name = 'MSB';
