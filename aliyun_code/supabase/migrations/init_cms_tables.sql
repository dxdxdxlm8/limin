-- ============================================
-- CMS 数据库初始表
-- ============================================
-- 删除旧表和函数
DROP TRIGGER IF EXISTS update_post_categories_updated_at ON post_categories;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS trigger_set_posts_published_at ON posts;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS post_categories CASCADE;
DROP FUNCTION IF EXISTS update_updated_x_at_column() CASCADE;
DROP FUNCTION IF EXISTS set_published_at() CASCADE;
-- 文章分类表
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES post_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE post_categories IS '{"chinese_title": "文章分类表", "english_title": "Post Categories", "chinese_description": "存储文章分类信息，支持层级分类结构，用于组织和管理文章内容", "english_description": "Stores article category information, supports hierarchical category structure for organizing and managing article content"}';
COMMENT ON COLUMN post_categories.id IS '{"chinese_title": "分类 ID", "english_title": "Category ID", "chinese_description": "分类的唯一标识符，自动生成 UUID", "english_description": "Unique identifier for category, auto-generated UUID", "format": "uuid"}';
COMMENT ON COLUMN post_categories.parent_id IS '{"chinese_title": "父分类 ID", "english_title": "Parent Category ID", "chinese_description": "父级分类的 ID，支持无限层级的分类树结构，NULL 表示顶级分类", "english_description": "ID of parent category, supports unlimited hierarchical category tree structure, NULL indicates top-level category", "format": "uuid"}';
COMMENT ON COLUMN post_categories.name IS '{"chinese_title": "分类名称", "english_title": "Category Name", "chinese_description": "分类的显示名称，用于前端展示和用户识别", "english_description": "Display name of category, used for frontend display and user identification"}';
COMMENT ON COLUMN post_categories.description IS '{"chinese_title": "分类描述", "english_title": "Category Description", "chinese_description": "分类的详细说明文字，可用于 SEO 和用户引导", "english_description": "Detailed description text of category, can be used for SEO and user guidance"}';
COMMENT ON COLUMN post_categories.image_url IS '{"chinese_title": "分类封面图", "english_title": "Category Image URL", "chinese_description": "分类的封面图片 URL 地址，用于可视化展示分类", "english_description": "Cover image URL of category, used for visual display of category", "format": "image"}';
COMMENT ON COLUMN post_categories.display_order IS '{"chinese_title": "显示顺序", "english_title": "Display Order", "chinese_description": "分类的排序权重值，数值越小越靠前，用于控制分类列表的显示顺序", "english_description": "Sort weight value of category, smaller value appears first, used to control display order in category list"}';
COMMENT ON COLUMN post_categories.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该分类是否已被删除，true 表示已删除但保留数据，支持数据恢复", "english_description": "Marks whether this category has been deleted, true means deleted but data retained, supports data recovery"}';
COMMENT ON COLUMN post_categories.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录分类被软删除的具体时间戳，便于数据审计和恢复操作", "english_description": "Records the specific timestamp when category was soft deleted, facilitates data auditing and recovery operations", "format": "date-time"}';
COMMENT ON COLUMN post_categories.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "分类记录的创建时间戳，自动生成，用于数据追踪和排序", "english_description": "Creation timestamp of category record, automatically generated, used for data tracking and sorting", "format": "date-time"}';
COMMENT ON COLUMN post_categories.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "分类记录的最后更新时间戳，每次修改时自动更新", "english_description": "Last update timestamp of category record, automatically updated on each modification", "format": "date-time"}';
CREATE INDEX idx_post_categories_parent_id ON post_categories(parent_id);
CREATE INDEX idx_post_categories_display_order ON post_categories(display_order);
CREATE INDEX idx_post_categories_is_deleted ON post_categories(is_deleted);
-- 文章表
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES post_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT,
  summary TEXT,
  content TEXT,
  featured_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  is_pin BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  visit_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE posts IS '{"chinese_title": "文章表", "english_title": "Posts", "chinese_description": "存储文章内容数据，支持 SEO 优化、软删除等功能，是内容管理系统的核心表", "english_description": "Stores article content data, supports SEO optimization, soft delete and other features, core table of content management system"}';
COMMENT ON COLUMN posts.id IS '{"chinese_title": "文章 ID", "english_title": "Post ID", "chinese_description": "文章的唯一标识符，自动生成 UUID", "english_description": "Unique identifier for post, auto-generated UUID", "format": "uuid"}';
COMMENT ON COLUMN posts.category_id IS '{"chinese_title": "分类 ID", "english_title": "Category ID", "chinese_description": "关联的文章分类 ID，用于文章分类归属和筛选", "english_description": "Associated article category ID, used for article categorization and filtering", "format": "uuid"}';
COMMENT ON COLUMN posts.title IS '{"chinese_title": "文章标题", "english_title": "Post Title", "chinese_description": "文章的主标题，用于页面展示和搜索", "english_description": "Main title of article, used for page display and search"}';
COMMENT ON COLUMN posts.slug IS '{"chinese_title": "URL 别名", "english_title": "URL Slug", "chinese_description": "URL 友好的文章标识符，用于生成 SEO 友好的 URL 路径", "english_description": "URL-friendly article identifier, used to generate SEO-friendly URL paths"}';
COMMENT ON COLUMN posts.summary IS '{"chinese_title": "文章摘要", "english_title": "Post Summary", "chinese_description": "文章的简短摘要或导语，用于列表页展示和 SEO 描述", "english_description": "Brief summary or introduction of article, used for list page display and SEO description"}';
COMMENT ON COLUMN posts.content IS '{"chinese_title": "文章内容", "english_title": "Post Content", "chinese_description": "文章的完整 Markdown 内容，支持代码高亮", "english_description": "Complete Markdown content of article, supports code highlighting", "format": "richtext"}';
COMMENT ON COLUMN posts.featured_image_url IS '{"chinese_title": "封面图 URL", "english_title": "Featured Image URL", "chinese_description": "文章封面图片的 URL 地址，用于列表展示和社交媒体分享", "english_description": "URL of article featured image, used for list display and social media sharing", "format": "image"}';
COMMENT ON COLUMN posts.seo_title IS '{"chinese_title": "SEO 标题", "english_title": "SEO Title", "chinese_description": "搜索引擎优化专用标题，用于 HTML 的 title 标签", "english_description": "SEO-specific title, used for HTML title tag"}';
COMMENT ON COLUMN posts.seo_description IS '{"chinese_title": "SEO 描述", "english_title": "SEO Description", "chinese_description": "搜索引擎优化专用描述，用于 HTML 的 meta description 标签", "english_description": "SEO-specific description, used for HTML meta description tag"}';
COMMENT ON COLUMN posts.status IS '{"chinese_title": "文章状态", "english_title": "Post Status", "chinese_description": "文章的发布状态，控制文章的可见性和编辑流程", "english_description": "Publication status of article, controls article visibility and editing workflow", "enum": ["draft", "published", "archived"], "enumDescriptions": ["草稿", "已发布", "已归档"]}';
COMMENT ON COLUMN posts.is_pin IS '{"chinese_title": "置顶标记", "english_title": "Pin Flag", "chinese_description": "标记文章是否置顶显示，置顶文章在列表中优先展示", "english_description": "Marks whether article is pinned for display, pinned articles appear first in lists"}';
COMMENT ON COLUMN posts.display_order IS '{"chinese_title": "显示顺序", "english_title": "Display Order", "chinese_description": "文章的排序权重值，数值越小越靠前，用于控制文章列表的显示顺序", "english_description": "Sort weight value of article, smaller value appears first, used to control display order in article list"}';
COMMENT ON COLUMN posts.visit_count IS '{"chinese_title": "访问次数", "english_title": "Visit Count", "chinese_description": "文章的累计访问次数统计，用于热门文章排序", "english_description": "Cumulative visit count statistics of article, used for popular article sorting"}';
COMMENT ON COLUMN posts.published_at IS '{"chinese_title": "发布时间", "english_title": "Published At", "chinese_description": "文章正式发布的时间戳，当状态变为 published 时自动设置", "english_description": "Timestamp when article was officially published, automatically set when status becomes published", "format": "date-time"}';
COMMENT ON COLUMN posts.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该文章是否已被删除，true 表示已删除但保留数据，支持数据恢复", "english_description": "Marks whether this article has been deleted, true means deleted but data retained, supports data recovery"}';
COMMENT ON COLUMN posts.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录文章被软删除的具体时间戳，便于数据审计和恢复操作", "english_description": "Records the specific timestamp when article was soft deleted, facilitates data auditing and recovery operations", "format": "date-time"}';
COMMENT ON COLUMN posts.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "文章记录的创建时间戳，自动生成，用于数据追踪和排序", "english_description": "Creation timestamp of article record, automatically generated, used for data tracking and sorting", "format": "date-time"}';
COMMENT ON COLUMN posts.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "文章记录的最后更新时间戳，每次修改时自动更新", "english_description": "Last update timestamp of article record, automatically updated on each modification", "format": "date-time"}';
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_is_pin ON posts(is_pin);
CREATE INDEX idx_posts_display_order ON posts(display_order);
CREATE INDEX idx_posts_is_deleted ON posts(is_deleted);
CREATE INDEX idx_posts_created_at ON posts(created_at);
-- 产品分类表
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE product_categories IS '{"chinese_title": "产品分类表", "english_title": "Product Categories", "chinese_description": "存储产品分类信息，支持层级分类结构，采用单表多语言设计", "english_description": "Stores product category information, supports hierarchical category structure with single-table multi-language design"}';
COMMENT ON COLUMN product_categories.id IS '{"chinese_title": "分类 ID", "english_title": "Category ID", "chinese_description": "分类的唯一标识符，多语言版本共享同一 ID", "english_description": "Unique identifier for category, shared across language versions"}';
COMMENT ON COLUMN product_categories.parent_id IS '{"chinese_title": "父分类 ID", "english_title": "Parent Category ID", "chinese_description": "父级分类的 ID，支持无限层级的分类树结构，空字符串表示顶级分类", "english_description": "ID of parent category, supports unlimited hierarchical category tree structure, empty string indicates top-level category"}';
COMMENT ON COLUMN product_categories.name IS '{"chinese_title": "分类名称", "english_title": "Category Name", "chinese_description": "分类的显示名称，用于前端展示和用户识别", "english_description": "Display name of category, used for frontend display and user identification"}';
COMMENT ON COLUMN product_categories.description IS '{"chinese_title": "分类描述", "english_title": "Category Description", "chinese_description": "分类的详细说明文字，可用于 SEO 和用户引导", "english_description": "Detailed description text of category, can be used for SEO and user guidance"}';
COMMENT ON COLUMN product_categories.image_url IS '{"chinese_title": "分类封面图", "english_title": "Category Image URL", "chinese_description": "分类的封面图片 URL 地址，用于可视化展示分类", "english_description": "Cover image URL of category, used for visual display of category", "format": "image"}';
COMMENT ON COLUMN product_categories.display_order IS '{"chinese_title": "显示顺序", "english_title": "Display Order", "chinese_description": "分类的排序权重值，数值越小越靠前，用于控制分类列表的显示顺序", "english_description": "Sort weight value of category, smaller value appears first, used to control display order in category list"}';
COMMENT ON COLUMN product_categories.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该分类是否已被删除，true 表示已删除但保留数据，支持数据恢复", "english_description": "Marks whether this category has been deleted, true means deleted but data retained, supports data recovery"}';
COMMENT ON COLUMN product_categories.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录分类被软删除的具体时间戳，便于数据审计和恢复操作", "english_description": "Records the specific timestamp when category was soft deleted, facilitates data auditing and recovery operations", "format": "date-time"}';
COMMENT ON COLUMN product_categories.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "分类记录的创建时间戳，自动生成，用于数据追踪和排序", "english_description": "Creation timestamp of category record, automatically generated, used for data tracking and sorting", "format": "date-time"}';
COMMENT ON COLUMN product_categories.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "分类记录的最后更新时间戳，每次修改时自动更新", "english_description": "Last update timestamp of category record, automatically updated on each modification", "format": "date-time"}';
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX idx_product_categories_display_order ON product_categories(display_order);
CREATE INDEX idx_product_categories_is_deleted ON product_categories(is_deleted);
-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NULL,
  summary TEXT,
  content TEXT,
  featured_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  original_price DECIMAL(10,2) DEFAULT 0.00,
  current_price DECIMAL(10,2) DEFAULT 0.00,
  stock_quantity INT DEFAULT 0,
  is_on_sale BOOLEAN DEFAULT true,
  is_pin BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  visit_count INT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  delete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE products IS '{"chinese_title": "产品表", "english_title": "Products", "chinese_description": "存储产品信息，支持价格、库存、SEO 等功能，采用单表多语言设计", "english_description": "Stores product information, supports pricing, inventory, SEO and other features with single-table multi-language design"}';
COMMENT ON COLUMN products.id IS '{"chinese_title": "产品 ID", "english_title": "Product ID", "chinese_description": "产品的唯一标识符，多语言版本共享同一 ID", "english_description": "Unique identifier for product, shared across language versions"}';
COMMENT ON COLUMN products.category_id IS '{"chinese_title": "分类 ID", "english_title": "Category ID", "chinese_description": "关联的产品分类 ID，用于产品分类归属和筛选", "english_description": "Associated product category ID, used for product categorization and filtering"}';
COMMENT ON COLUMN products.title IS '{"chinese_title": "产品标题", "english_title": "Product Title", "chinese_description": "产品的主标题，用于页面展示和搜索", "english_description": "Main title of product, used for page display and search"}';
COMMENT ON COLUMN products.slug IS '{"chinese_title": "URL 别名", "english_title": "URL Slug", "chinese_description": "URL 友好的产品标识符，用于生成 SEO 友好的 URL 路径", "english_description": "URL-friendly product identifier, used to generate SEO-friendly URL paths"}';
COMMENT ON COLUMN products.summary IS '{"chinese_title": "产品摘要", "english_title": "Product Summary", "chinese_description": "产品的简短摘要或简介，用于列表页展示", "english_description": "Brief summary or introduction of product, used for list page display"}';
COMMENT ON COLUMN products.content IS '{"chinese_title": "产品详情", "english_title": "Product Content", "chinese_description": "产品的完整 HTML 详情内容，支持富文本编辑", "english_description": "Complete HTML detail content of product, supports rich text editing", "format": "richtext"}';
COMMENT ON COLUMN products.featured_image_url IS '{"chinese_title": "封面图 URL", "english_title": "Featured Image URL", "chinese_description": "产品封面图片的 URL 地址，用于列表展示", "english_description": "URL of product featured image, used for list display", "format": "image"}';
COMMENT ON COLUMN products.seo_title IS '{"chinese_title": "SEO 标题", "english_title": "SEO Title", "chinese_description": "搜索引擎优化专用标题，用于 HTML 的 title 标签", "english_description": "SEO-specific title, used for HTML title tag"}';
COMMENT ON COLUMN products.seo_description IS '{"chinese_title": "SEO 描述", "english_title": "SEO Description", "chinese_description": "搜索引擎优化专用描述，用于 HTML 的 meta description 标签", "english_description": "SEO-specific description, used for HTML meta description tag"}';
COMMENT ON COLUMN products.status IS '{"chinese_title": "产品状态", "english_title": "Product Status", "chinese_description": "产品的发布状态，控制产品的可见性和编辑流程", "english_description": "Publication status of product, controls product visibility and editing workflow", "enum": ["draft", "published", "archived"], "enumDescriptions": ["草稿", "已发布", "已归档"]}';
COMMENT ON COLUMN products.original_price IS '{"chinese_title": "原价", "english_title": "Original Price", "chinese_description": "产品的原始价格，用于显示折扣对比", "english_description": "Original price of product, used to display discount comparison"}';
COMMENT ON COLUMN products.current_price IS '{"chinese_title": "现价", "english_title": "Current Price", "chinese_description": "产品的当前销售价格或促销价", "english_description": "Current selling price or promotional price of product"}';
COMMENT ON COLUMN products.stock_quantity IS '{"chinese_title": "库存数量", "english_title": "Stock Quantity", "chinese_description": "产品的当前库存数量，用于库存管理", "english_description": "Current stock quantity of product, used for inventory management"}';
COMMENT ON COLUMN products.is_on_sale IS '{"chinese_title": "是否在售", "english_title": "On Sale Flag", "chinese_description": "标记产品是否正在销售，控制产品的可购买状态", "english_description": "Marks whether product is on sale, controls purchasable status of product"}';
COMMENT ON COLUMN products.is_pin IS '{"chinese_title": "置顶标记", "english_title": "Pin Flag", "chinese_description": "标记产品是否置顶显示，置顶产品在列表中优先展示", "english_description": "Marks whether product is pinned for display, pinned products appear first in lists"}';
COMMENT ON COLUMN products.display_order IS '{"chinese_title": "显示顺序", "english_title": "Display Order", "chinese_description": "产品的排序权重值，数值越小越靠前，用于控制产品列表的显示顺序", "english_description": "Sort weight value of product, smaller value appears first, used to control display order in product list"}';
COMMENT ON COLUMN products.visit_count IS '{"chinese_title": "访问次数", "english_title": "Visit Count", "chinese_description": "产品的累计访问次数统计，用于热门产品排序", "english_description": "Cumulative visit count statistics of product, used for popular product sorting"}';
COMMENT ON COLUMN products.is_deleted IS '{"chinese_title": "软删除标记", "english_title": "Soft Delete Flag", "chinese_description": "标记该产品是否已被删除，true 表示已删除但保留数据，支持数据恢复", "english_description": "Marks whether this product has been deleted, true means deleted but data retained, supports data recovery"}';
COMMENT ON COLUMN products.delete_time IS '{"chinese_title": "删除时间", "english_title": "Delete Time", "chinese_description": "记录产品被软删除的具体时间戳，便于数据审计和恢复操作", "english_description": "Records the specific timestamp when product was soft deleted, facilitates data auditing and recovery operations", "format": "date-time"}';
COMMENT ON COLUMN products.created_at IS '{"chinese_title": "创建时间", "english_title": "Created At", "chinese_description": "产品记录的创建时间戳，自动生成，用于数据追踪和排序", "english_description": "Creation timestamp of product record, automatically generated, used for data tracking and sorting", "format": "date-time"}';
COMMENT ON COLUMN products.updated_at IS '{"chinese_title": "更新时间", "english_title": "Updated At", "chinese_description": "产品记录的最后更新时间戳，每次修改时自动更新", "english_description": "Last update timestamp of product record, automatically updated on each modification", "format": "date-time"}';
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_is_pin ON products(is_pin);
CREATE INDEX idx_products_display_order ON products(display_order);
CREATE INDEX idx_products_is_deleted ON products(is_deleted);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_current_price ON products(current_price);
CREATE INDEX idx_products_status ON products(status);
-- 触发器函数
CREATE OR REPLACE FUNCTION update_updated_x_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 创建触发器
CREATE TRIGGER update_post_categories_updated_at
  BEFORE UPDATE ON post_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
CREATE TRIGGER trigger_set_posts_published_at
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_x_at_column();
-- 启用 RLS
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- 文章分类 RLS
DROP POLICY IF EXISTS "post_categories_select_all" ON post_categories;
CREATE POLICY "post_categories_select_all" ON post_categories FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS "post_categories_insert_authenticated" ON post_categories;
CREATE POLICY "post_categories_insert_authenticated" ON post_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "post_categories_update_authenticated" ON post_categories;
CREATE POLICY "post_categories_update_authenticated" ON post_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "post_categories_delete_authenticated" ON post_categories;
CREATE POLICY "post_categories_delete_authenticated" ON post_categories FOR DELETE TO authenticated USING (true);
-- 文章 RLS
DROP POLICY IF EXISTS "posts_select_published" ON posts;
CREATE POLICY "posts_select_published" ON posts FOR SELECT USING (status = 'published' AND is_deleted = false);
DROP POLICY IF EXISTS "posts_select_all_authenticated" ON posts;
CREATE POLICY "posts_select_all_authenticated" ON posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "posts_insert_authenticated" ON posts;
CREATE POLICY "posts_insert_authenticated" ON posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "posts_update_authenticated" ON posts;
CREATE POLICY "posts_update_authenticated" ON posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "posts_delete_authenticated" ON posts;
CREATE POLICY "posts_delete_authenticated" ON posts FOR DELETE TO authenticated USING (true);
-- 产品分类 RLS
DROP POLICY IF EXISTS "product_categories_select_all" ON product_categories;
CREATE POLICY "product_categories_select_all" ON product_categories FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS "product_categories_insert_authenticated" ON product_categories;
CREATE POLICY "product_categories_insert_authenticated" ON product_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "product_categories_update_authenticated" ON product_categories;
CREATE POLICY "product_categories_update_authenticated" ON product_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "product_categories_delete_authenticated" ON product_categories;
CREATE POLICY "product_categories_delete_authenticated" ON product_categories FOR DELETE TO authenticated USING (true);
-- 产品 RLS
DROP POLICY IF EXISTS "products_select_published" ON products;
CREATE POLICY "products_select_published" ON products FOR SELECT USING (status = 'published' AND is_deleted = false AND is_on_sale = true);
DROP POLICY IF EXISTS "products_select_all_authenticated" ON products;
CREATE POLICY "products_select_all_authenticated" ON products FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "products_insert_authenticated" ON products;
CREATE POLICY "products_insert_authenticated" ON products FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "products_update_authenticated" ON products;
CREATE POLICY "products_update_authenticated" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "products_delete_authenticated" ON products;
CREATE POLICY "products_delete_authenticated" ON products FOR DELETE TO authenticated USING (true);
-- 授予权限
GRANT SELECT ON post_categories TO anon, authenticated;
GRANT SELECT ON posts TO anon, authenticated;
GRANT ALL ON post_categories TO authenticated;
GRANT ALL ON posts TO authenticated;
GRANT SELECT ON product_categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT ALL ON product_categories TO authenticated;
GRANT ALL ON products TO authenticated;
-- 插入测试数据 - 文章分类
INSERT INTO post_categories (name, description, display_order) VALUES
  ('公司动态', 'LIMIN AUDIO 品牌动态和新闻', 1),
  ('新品发布', '最新产品发布信息', 2),
  ('展会活动', '音响展会和活动报道', 3),
  ('行业资讯', '高端音响行业资讯', 4);
-- 插入测试数据 - 文章
INSERT INTO posts (category_id, title, slug, summary, content, status, published_at, display_order) VALUES
  ((SELECT id FROM post_categories WHERE name = '新品发布'), 'Ayon Audio 发布全新旗舰解码器 Polaris V', 'ayon-polaris-v', '全新 Polaris V 解码器采用最新电子管技术，配备升级的电源供应系统和改进的模拟输出级', 'Ayon Audio 正式发布全新旗舰解码器 Polaris V，这是品牌 25 周年纪念之作。新机型采用最新一代电子管技术，配备完全重新设计的电源供应系统。', 'published', NOW(), 1),
  ((SELECT id FROM post_categories WHERE name = '展会活动'), '上海音响展圆满落幕', 'shanghai-audio-show', '为期三天的上海音响展圆满落幕，感谢所有莅临 LIMIN AUDIO 展台的朋友', '2026 年上海音响展于 4 月 15 日圆满落幕。LIMIN AUDIO 携手旗下所有品牌亮相。', 'published', NOW() - INTERVAL '5 days', 2),
  ((SELECT id FROM post_categories WHERE name = '行业资讯'), 'Benchmark DAC3 荣获年度大奖', 'benchmark-award', '国际权威音响杂志《What Hi-Fi?》评选 Benchmark DAC3 为 2026 年度最佳解码器', 'Benchmark DAC3 荣获《What Hi-Fi?》2026 年度最佳解码器大奖。', 'published', NOW() - INTERVAL '10 days', 3);
-- 插入测试数据 - 产品分类
INSERT INTO product_categories (name, description, display_order) VALUES
  ('解码器', 'D/A 转换器，数字信号转模拟音频', 1),
  ('数字播放器', '数字音乐播放设备', 2),
  ('黑胶唱机', '模拟黑胶唱片播放设备', 3),
  ('扬声器', '音箱和喇叭系统', 4),
  ('一体化系统', '集成式音响系统', 5),
  ('电源处理', '电源净化和管理设备', 6),
  ('放大器', '音频功率放大器', 7);
-- 插入测试数据 - 产品
INSERT INTO products (category_id, title, slug, summary, content, status, is_on_sale, display_order) VALUES
  ((SELECT id FROM product_categories WHERE name = '解码器'), 'Ayon Audio Polaris III', 'ayon-polaris-iii', '旗舰级电子管解码器，采用最新电子管技术', 'Ayon Audio Polaris III 是品牌旗舰解码器，采用最新电子管技术，带来极致音质体验。', 'published', true, 1),
  ((SELECT id FROM product_categories WHERE name = '解码器'), 'Benchmark DAC3', 'benchmark-dac3', '专业级 D/A 转换器，录音室标准', 'Benchmark DAC3 是专业级 D/A 转换器，采用 UltraLock2 时钟技术，精准音频还原。', 'published', true, 2),
  ((SELECT id FROM product_categories WHERE name = '解码器'), 'MSB Discrete DAC', 'msb-discrete', '顶级分立电阻 ladder DAC', 'MSB Discrete DAC 采用分立电阻 ladder 架构，代表数字音频转换的最高水准。', 'published', true, 3),
  ((SELECT id FROM product_categories WHERE name = '数字播放器'), 'Ayon Audio Spheris III', 'ayon-spheris', '旗舰级数字播放器，支持所有主流数字格式', 'Ayon Audio Spheris III 是旗舰级数字播放器，支持所有主流数字格式。', 'published', true, 4),
  ((SELECT id FROM product_categories WHERE name = '扬声器'), 'Ryan Speaker Petra', 'ryan-petra', '高端书架式扬声器，精准音场还原', 'Ryan Speaker Petra 是高端书架式扬声器，精准音场还原。', 'published', true, 5),
  ((SELECT id FROM product_categories WHERE name = '一体化系统'), 'Lyravox VL3', 'lyravox-vl3', '德国高端一体化音响系统，内置流媒体功能', 'Lyravox VL3 是德国高端一体化音响系统，内置流媒体功能。', 'published', true, 6);
