-- 创建许愿表
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_request TEXT NOT NULL CHECK (char_length(feature_request) >= 10 AND char_length(feature_request) <= 500),
  similar_product TEXT,
  submitter TEXT DEFAULT 'Anonymous',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_implemented BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_wishes_status ON wishes(status);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- 创建策略：任何人都可以插入（提交愿望）
CREATE POLICY "Anyone can insert wishes" ON wishes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 创建策略：任何人都可以查看已批准的愿望
CREATE POLICY "Anyone can view approved wishes" ON wishes
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- 创建策略：只有管理员可以更新和删除（通过 service_role）
-- 注意：这个策略需要使用 service_role key，不对普通用户开放

-- 创建更新时间的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wishes_updated_at
  BEFORE UPDATE ON wishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建视图：只显示已批准的愿望（用于前端）
CREATE OR REPLACE VIEW approved_wishes AS
SELECT
  id,
  feature_request,
  similar_product,
  submitter,
  is_implemented,
  created_at
FROM wishes
WHERE status = 'approved'
ORDER BY created_at DESC;

-- 注释
COMMENT ON TABLE wishes IS '许愿池数据表';
COMMENT ON COLUMN wishes.feature_request IS '功能需求描述';
COMMENT ON COLUMN wishes.similar_product IS '同类产品参考';
COMMENT ON COLUMN wishes.submitter IS '提交者名称';
COMMENT ON COLUMN wishes.status IS '审核状态: pending(待审核), approved(已批准), rejected(已拒绝)';
COMMENT ON COLUMN wishes.is_implemented IS '是否已实现';
